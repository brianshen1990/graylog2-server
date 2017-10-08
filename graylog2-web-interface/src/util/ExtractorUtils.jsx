import Routes from 'routing/Routes';

const ExtractorTypes = Object.freeze({
  COPY_INPUT: 'copy_input',
  GROK: 'grok',
  JSON: 'json',
  REGEX: 'regex',
  REGEX_REPLACE: 'regex_replace',
  SPLIT_AND_INDEX: 'split_and_index',
  SUBSTRING: 'substring',
  LOOKUP_TABLE: 'lookup_table',
});

const ExtractorUtils = {
  ConverterTypes: Object.freeze({
    NUMERIC: 'numeric',
    DATE: 'date',
    HASH: 'hash',
    SPLIT_AND_COUNT: 'split_and_count',
    IP_ANONYMIZER: 'ip_anonymizer',
    SYSLOG_PRI_LEVEL: 'syslog_pri_level',
    SYSLOG_PRI_FACILITY: 'syslog_pri_facility',
    TOKENIZER: 'tokenizer',
    CSV: 'csv',
    LOWERCASE: 'lowercase',
    UPPERCASE: 'uppercase',
    FLEXDATE: 'flexdate',
    LOOKUP_TABLE: 'lookup_table',
  }),
  ExtractorTypes: ExtractorTypes,
  EXTRACTOR_TYPES: Object.keys(ExtractorTypes).map(type => type.toLocaleLowerCase()),

  getNewExtractorRoutes(sourceNodeId, sourceInputId, fieldName, messageIndex, messageId) {
    const routes = {};
    this.EXTRACTOR_TYPES.forEach((extractorType) => {
      routes[extractorType] = Routes.new_extractor(sourceNodeId, sourceInputId, extractorType, fieldName, messageIndex, messageId);
    });

    return routes;
  },

  getReadableExtractorTypeName(extractorType) {
    switch (extractorType) {
      case ExtractorTypes.COPY_INPUT:
        return '拷贝输入';
      case ExtractorTypes.GROK:
        return 'Grok 模式';
      case ExtractorTypes.JSON:
        return 'JSON';
      case ExtractorTypes.REGEX:
        return '正则表达式';
      case ExtractorTypes.REGEX_REPLACE:
        return '正则替换';
      case ExtractorTypes.SPLIT_AND_INDEX:
        return '分割和序号';
      case ExtractorTypes.SUBSTRING:
        return '子字符串';
      case ExtractorTypes.LOOKUP_TABLE:
        return '查找表';
      default:
        return extractorType;
    }
  },

  getReadableConverterTypeName(converterType) {
    switch (converterType) {
      case this.ConverterTypes.NUMERIC:
        return '数字';
      case this.ConverterTypes.DATE:
        return '日期';
      case this.ConverterTypes.FLEXDATE:
        return '灵活日期';
      case this.ConverterTypes.HASH:
        return '哈希';
      case this.ConverterTypes.LOWERCASE:
        return '小写';
      case this.ConverterTypes.UPPERCASE:
        return '大写';
      case this.ConverterTypes.TOKENIZER:
        return 'Key = Value 组合转换为字段';
      case this.ConverterTypes.CSV:
        return 'CSV 转换为字段';
      case this.ConverterTypes.SPLIT_AND_COUNT:
        return '分割和位置';
      case this.ConverterTypes.IP_ANONYMIZER:
        return 'IPv4 地址';
      case this.ConverterTypes.SYSLOG_PRI_LEVEL:
        return 'Syslog PRI转换为级别';
      case this.ConverterTypes.SYSLOG_PRI_FACILITY:
        return 'Syslog PRI转换为Facility';
      case this.ConverterTypes.LOOKUP_TABLE:
        return '查找表';
      default:
        return converterType;
    }
  },

  getEffectiveConfiguration(defaultConfiguration, currentConfiguration) {
    const effectiveConfiguration = {};

    for (const key in defaultConfiguration) {
      if (defaultConfiguration.hasOwnProperty(key)) {
        effectiveConfiguration[key] = defaultConfiguration[key];
      }
    }

    for (const key in currentConfiguration) {
      if (currentConfiguration.hasOwnProperty(key)) {
        effectiveConfiguration[key] = currentConfiguration[key];
      }
    }

    return effectiveConfiguration;
  },
};

export default ExtractorUtils;
