/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog2.alerts.types;

import com.google.common.collect.Lists;
import com.google.inject.assistedinject.Assisted;
import com.google.inject.assistedinject.AssistedInject;
import org.graylog2.alerts.AbstractAlertCondition;
import org.graylog2.indexer.FieldTypeException;
import org.graylog2.indexer.results.FieldStatsResult;
import org.graylog2.indexer.results.ResultMessage;
import org.graylog2.indexer.searches.Searches;
import org.graylog2.plugin.Message;
import org.graylog2.plugin.MessageSummary;
import org.graylog2.plugin.Tools;
import org.graylog2.plugin.alarms.AlertCondition;
import org.graylog2.plugin.configuration.ConfigurationRequest;
import org.graylog2.plugin.configuration.fields.ConfigurationField;
import org.graylog2.plugin.configuration.fields.DropdownField;
import org.graylog2.plugin.configuration.fields.NumberField;
import org.graylog2.plugin.configuration.fields.TextField;
import org.graylog2.plugin.indexer.searches.timeranges.InvalidRangeParametersException;
import org.graylog2.plugin.indexer.searches.timeranges.RelativeRange;
import org.graylog2.plugin.streams.Stream;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

public class FieldValueAlertCondition extends AbstractAlertCondition {
    private static final Logger LOG = LoggerFactory.getLogger(FieldValueAlertCondition.class);

    enum CheckType {
        MEAN("mean value"), MIN("min value"), MAX("max value"), SUM("sum"), STDDEV("standard deviation");

        private final String description;

        CheckType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    enum ThresholdType {
        LOWER, HIGHER
    }

    public interface Factory extends AlertCondition.Factory {
        @Override
        FieldValueAlertCondition create(Stream stream,
                                        @Assisted("id") String id,
                                        DateTime createdAt,
                                        @Assisted("userid") String creatorUserId,
                                        Map<String, Object> parameters,
                                        @Assisted("title") @Nullable String title);
        @Override
        Config config();
        @Override
        Descriptor descriptor();
    }

    public static class Config implements AlertCondition.Config {
        public Config() {
        }

        @Override
        public ConfigurationRequest getRequestedConfiguration() {
            final ConfigurationRequest configurationRequest = ConfigurationRequest.createWithFields(
                    new TextField("field", "字段", "", "字段名会被检测", ConfigurationField.Optional.NOT_OPTIONAL),
                    new NumberField("time", "时间范围", 5, "对所有输入数据每分钟进行统计", ConfigurationField.Optional.NOT_OPTIONAL),
                    new DropdownField(
                            "threshold_type",
                            "临界值类型",
                            ThresholdType.HIGHER.toString(),
                            DropdownField.ValueTemplates.valueMapFromEnum(ThresholdType.class, thresholdType -> thresholdType.name().toLowerCase(Locale.ENGLISH)),
                            "选择触发条件：当值高于或者低于临界值",
                            ConfigurationField.Optional.NOT_OPTIONAL),
                    new NumberField("threshold", "Threshold", 0.0, "Value which triggers an alert if crossed", ConfigurationField.Optional.NOT_OPTIONAL),
                    new DropdownField(
                            "type",
                            "聚合类型",
                            CheckType.MAX.toString(),
                            Arrays.stream(CheckType.values()).collect(Collectors.toMap(Enum::toString, CheckType::getDescription)),
                            "选择聚合统计类型",
                            ConfigurationField.Optional.NOT_OPTIONAL)
            );
            configurationRequest.addFields(AbstractAlertCondition.getDefaultConfigurationFields());

            return configurationRequest;
        }
    }

    public static class Descriptor extends AlertCondition.Descriptor {
        public Descriptor() {
            super(
                "字段聚合告警条件",
                "https://www.graylog.org/",
                "高告警条件会在聚合值与临界区间相比较的情况下触发。"
            );
        }
    }

    private final int time;
    private final ThresholdType thresholdType;
    private final Number threshold;
    private final CheckType type;
    private final String field;
    private final DecimalFormat decimalFormat;
    private final Searches searches;

    @AssistedInject
    public FieldValueAlertCondition(Searches searches,
                                    @Assisted Stream stream,
                                    @Nullable @Assisted("id") String id,
                                    @Assisted DateTime createdAt,
                                    @Assisted("userid") String creatorUserId,
                                    @Assisted Map<String, Object> parameters,
                                    @Assisted("title") @Nullable String title) {
        super(stream, id, Type.FIELD_VALUE.toString(), createdAt, creatorUserId, parameters, title);
        this.searches = searches;

        this.decimalFormat = new DecimalFormat("#.###", DecimalFormatSymbols.getInstance(Locale.ENGLISH));

        this.time = Tools.getNumber(parameters.get("time"), 5).intValue();
        this.thresholdType = ThresholdType.valueOf(((String) parameters.get("threshold_type")).toUpperCase(Locale.ENGLISH));
        this.threshold = Tools.getNumber(parameters.get("threshold"), 0.0).doubleValue();
        this.type = CheckType.valueOf(((String) parameters.get("type")).toUpperCase(Locale.ENGLISH));
        this.field = (String) parameters.get("field");
    }

    @Override
    public String getDescription() {
        return "time: " + time
            + ", field: " + field
            + ", check type: " + type.toString().toLowerCase(Locale.ENGLISH)
            + ", threshold_type: " + thresholdType.toString().toLowerCase(Locale.ENGLISH)
            + ", threshold: " + decimalFormat.format(threshold)
            + ", grace: " + grace
            + ", repeat notifications: " + repeatNotifications;
    }


    @Override
    public CheckResult runCheck() {
        try {
            final String filter = "streams:" + stream.getId();
            // TODO we don't support cardinality yet
            final FieldStatsResult fieldStatsResult = searches.fieldStats(field, "*", filter,
                RelativeRange.create(time * 60), false, true, false);

            if (fieldStatsResult.getCount() == 0) {
                LOG.debug("Alert check <{}> did not match any messages. Returning not triggered.", type);
                return new NegativeCheckResult();
            }

            final double result;
            switch (type) {
                case MEAN:
                    result = fieldStatsResult.getMean();
                    break;
                case MIN:
                    result = fieldStatsResult.getMin();
                    break;
                case MAX:
                    result = fieldStatsResult.getMax();
                    break;
                case SUM:
                    result = fieldStatsResult.getSum();
                    break;
                case STDDEV:
                    result = fieldStatsResult.getStdDeviation();
                    break;
                default:
                    LOG.error("No such field value check type: [{}]. Returning not triggered.", type);
                    return new NegativeCheckResult();
            }

            LOG.debug("Alert check <{}> result: [{}]", id, result);

            if (Double.isInfinite(result)) {
                // This happens when there are no ES results/docs.
                LOG.debug("Infinite value. Returning not triggered.");
                return new NegativeCheckResult();
            }

            final boolean triggered;
            switch (thresholdType) {
                case HIGHER:
                    triggered = result > threshold.doubleValue();
                    break;
                case LOWER:
                    triggered = result < threshold.doubleValue();
                    break;
                default:
                    triggered = false;
            }

            if (triggered) {
                final String resultDescription = "Field " + field + " had a " + type + " of "
                    + decimalFormat.format(result) + " in the last " + time + " minutes with trigger condition "
                    + thresholdType + " than " + decimalFormat.format(threshold) + ". "
                    + "(Current grace time: " + grace + " minutes)";

                final List<MessageSummary> summaries;
                if (getBacklog() > 0) {
                    final List<ResultMessage> searchResult = fieldStatsResult.getSearchHits();
                    summaries = Lists.newArrayListWithCapacity(searchResult.size());
                    for (ResultMessage resultMessage : searchResult) {
                        final Message msg = resultMessage.getMessage();
                        summaries.add(new MessageSummary(resultMessage.getIndex(), msg));
                    }
                } else {
                    summaries = Collections.emptyList();
                }

                return new CheckResult(true, this, resultDescription, Tools.nowUTC(), summaries);
            } else {
                return new NegativeCheckResult();
            }
        } catch (InvalidRangeParametersException e) {
            // cannot happen lol
            LOG.error("Invalid timerange.", e);
            return null;
        } catch (FieldTypeException e) {
            LOG.debug("Field [{}] seems not to have a numerical type or doesn't even exist at all. Returning not triggered.", field, e);
            return new NegativeCheckResult();
        }
    }
}
