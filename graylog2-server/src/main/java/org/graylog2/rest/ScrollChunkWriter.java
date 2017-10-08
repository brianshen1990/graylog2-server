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
package org.graylog2.rest;

import au.com.bytecode.opencsv.CSVWriter;
import org.graylog2.indexer.results.ResultMessage;
import org.graylog2.indexer.results.ScrollResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

@Provider
@Produces(MoreMediaTypes.TEXT_CSV)
public class ScrollChunkWriter implements MessageBodyWriter<ScrollResult.ScrollChunk> {
    private static final Logger LOG = LoggerFactory.getLogger(ScrollChunkWriter.class);

    @Override
    public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        return ScrollResult.ScrollChunk.class.equals(type) && MoreMediaTypes.TEXT_CSV_TYPE.isCompatible(mediaType);

    }

    @Override
    public long getSize(ScrollResult.ScrollChunk scrollChunk,
                        Class<?> type,
                        Type genericType,
                        Annotation[] annotations,
                        MediaType mediaType) {
        return -1;
    }

    @Override
    public void writeTo(ScrollResult.ScrollChunk scrollChunk,
                        Class<?> type,
                        Type genericType,
                        Annotation[] annotations,
                        MediaType mediaType,
                        MultivaluedMap<String, Object> httpHeaders,
                        OutputStream entityStream) throws IOException, WebApplicationException {
        if (LOG.isDebugEnabled()) {
            LOG.debug("[{}] Writing chunk {}", Thread.currentThread().getId(), scrollChunk.getChunkNumber());
        }

        if (scrollChunk.isFirstChunk()) {
            entityStream.write(0xEF);
            entityStream.write(0xBB);
            entityStream.write(0xBF);
        }

        final CSVWriter csvWriter = new CSVWriter(new OutputStreamWriter(entityStream, StandardCharsets.UTF_8));

        final List<String> fields = scrollChunk.getFields();
        final int numberOfFields = fields.size();

        if (scrollChunk.isFirstChunk()) {
            List<String> mapped_Columns =  new ArrayList<String>();
            try {
                // write field headers only on first chunk
                HashMap<String, String> mapping_Columns = new HashMap<>();
                mapping_Columns.put("action", "措施");
                mapping_Columns.put("ips_rule", "入侵防御规则");
                mapping_Columns.put("url_category1", "URL类别");
                mapping_Columns.put("host_name", "主机名");
                mapping_Columns.put("source_address", "客户端地址");
                mapping_Columns.put("destination_address", "服务器地址");
                mapping_Columns.put("destination_port", "服务器端口");
                mapping_Columns.put("protocol", "协议类型");
                mapping_Columns.put("application_id", "应用");
                mapping_Columns.put("rule_name", "规则名称");
                mapping_Columns.put("type", "日志类别");
                mapping_Columns.put("malware_name", "恶意软件名称");
                mapping_Columns.put("source_port", "客户端端口");
                mapping_Columns.put("log_time", "日志时间");
                mapping_Columns.put("source_user", "用户");
                mapping_Columns.put("application_attribute_id", "应用属性");
                mapping_Columns.put("file_name", "文件名");
                mapping_Columns.put("wrs_score", "WRS 评分");
                mapping_Columns.put("host", "主机");
                mapping_Columns.put("url", "URL");
                mapping_Columns.put("url_category2", "URL类别2");
                mapping_Columns.put("url_category3", "URL类别3");
                mapping_Columns.put("url_category4", "URL类别4");
                mapping_Columns.put("direction", "方向");
                mapping_Columns.put("mail_sender", "发件人");
                mapping_Columns.put("mail_recipient", "收件人");
                mapping_Columns.put("mail_subject", "邮件主题");
                for (String str : fields) {
                    if (mapping_Columns.containsKey(str)) {
                        mapped_Columns.add(mapping_Columns.get(str));
                    } else {
                        mapped_Columns.add(str);
                    }
                }
            }catch(Exception e){
                mapped_Columns = fields;
            }
            csvWriter.writeNext(mapped_Columns.toArray(new String[numberOfFields]));
        }
        // write result set in same order as the header row
        final String[] fieldValues = new String[numberOfFields];
        for (ResultMessage message : scrollChunk.getMessages()) {
            int idx = 0;
            // first collect all values from the current message
            for (String fieldName : fields) {
                final Object val = message.getMessage().getField(fieldName);
                if (val == null) {
                    fieldValues[idx] = null;
                } else {
                    String stringVal = val.toString();
                    fieldValues[idx] = stringVal
                            .replaceAll("\n", "\\\\n")
                            .replaceAll("\r", "\\\\r");
                }
                idx++;
            }

            // write the complete line, some fields might not be present in the message, so there might be null values
            csvWriter.writeNext(fieldValues);
        }
        if (csvWriter.checkError()) {
            LOG.error("Encountered unspecified error when writing message result as CSV, result is likely malformed.");
        }
        csvWriter.close();
    }
}
