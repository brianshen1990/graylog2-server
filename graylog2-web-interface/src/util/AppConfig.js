const AppConfig = {
  gl2ServerUrl() {
    return window.appConfig.gl2ServerUrl;
  },

  gl2AppPathPrefix() {
    return window.appConfig.gl2AppPathPrefix;
  },

  gl2DevMode() {
    // The DEVELOPMENT variable will be set by webpack via the DefinePlugin.
    // eslint-disable-next-line no-undef
    return typeof (DEVELOPMENT) !== 'undefined' && DEVELOPMENT;
  },

  rootTimeZone() {
    return window.appConfig.rootTimeZone;
  },

  freeforme(){
    // Switch to define customization.
    return false;
  },

  pattern_mappings() {
    // This is in search page show colums titles. If we use K-V split, and it show in english,
    // But we want them to show in CN, so define the mapping relationship here.
    if(this.freeforme()) {
      return {
        "action": "措施",
        "ips_rule": "入侵防御规则",
        "url_category1": "URL类别",
        "host_name": "主机名",
        "source_address": "客户端地址",
        "destination_address": "服务器地址",
        "destination_port": "服务器端口",
        "protocol": "协议类型",
        "application_id": "应用",
        "rule_name": "规则名称",
        "type": "日志类别",
        "malware_name": "恶意软件名称",
        "source_port": "客户端端口",
        "log_time": "日志时间",
        "source_user": "用户",
        "application_attribute_id": "应用属性",
        "file_name": "文件名",
        "wrs_score": "WRS 评分",
        "host": "主机",
        "url": "URL",
        "url_category2": "URL类别2",
        "url_category3": "URL类别3",
        "url_category4": "URL类别4",
        "direction": "方向",
        "mail_sender": "发件人",
        "mail_recipient": "收件人",
        "mail_subject": "邮件主题"
      };
    }else{
      return {};
    }
  },

  get_show_list_in_order(){
    // This is in search page show colums, default, Graylog2 show timestamp, source, messages. But sometimes we want to
    // show some special colums in the beginning. This is the comparation funtion which defines the sequeneces of colums.
    // i.e. In my system, I want fields in get_show_list_in_order to show in front, so I used these functions.
    if(this.freeforme()) {
      return ["host_name", "source_address", "destination_address", "destination_port", "action",
        "ips_rule", "application_id", "type", "malware_name", "source_port"]
    }else{
      return [];
    }
  },

  compare_field1_field2(field1, field2 ){
    // This is in search page show colums, default, Graylog2 show timestamp, source, messages. But sometimes we want to
    // show some special colums in the beginning. This is the comparation funtion which defines the sequeneces of colums.
    // i.e. In my system, I want fields in get_show_list_in_order to show in front, so I used these functions.
    try {
      if (this.get_show_list_in_order().indexOf(field1)>=0 && this.get_show_list_in_order().indexOf(field2)<0) {
        return -1;
      }
      if (this.get_show_list_in_order().indexOf(field1)<0 && this.get_show_list_in_order().indexOf(field2)>=0) {
        return 1;
      }
      if (this.get_show_list_in_order().indexOf(field1)<0 && this.get_show_list_in_order().indexOf(field2)<0) {
        var ret =  field1.toLowerCase().localeCompare(field2.toLowerCase());
        return ret;
      }
      if (this.get_show_list_in_order().indexOf(field1)>=0 && this.get_show_list_in_order().indexOf(field2)>=0) {
        var ret =( ( this.get_show_list_in_order().indexOf(field1) > this.get_show_list_in_order().indexOf(field2) ) ? 1:-1 );
        return ret;
      }
    }catch(e){
      console.log("error 1" + e);
      return field1.localeCompare(field2)
    }
  },

  modify_search_condition(query){
    // This is before every search, and you can add some customization here.
    // i.e. In my system, I want the results only with "Violation log" , so I add there.
    if(false){
      const add_query = "log_type:\"Violation log\"";
      if(add_query && add_query.length > 0) {
        if (!query || query === "") {
          // all
          query = add_query;
        } else {
          // No type
          var index_count = query.indexOf("log_type:");
          if (index_count < 0) {
            query = "( " + query + " ) AND " + add_query;
          }
        }
        return query;
      }
    }else{
      return query;
    }
  },

  transfer_search_confition(query){
    // This is before every search, and you can add some customization here.
    // i.e. In my system, I want the results only with "Violation log" , so I add there.
    if(false) {
      const add_query = "log_type:\"Violation log\"";
      if (query === "*") {
        // all
        query = add_query;
      } else {
        // No type
        var index_count = query.indexOf("log_type:");
        if (index_count < 0) {
          query = "( " + query + " ) AND " + add_query;
        }
      }
      return query;
    }else{
      return query;
    }
  },

  skip_show_fields(key){
    // This is the function that decide which fields to hide.
    // i.e. In my system, I use some extractors, and some of them result in some of middle value, I define them as z_xxx,
    // So I choose to hide them.
    if(this.freeforme()) {
      return key.indexOf("z_") == 0;
    }else {
      return false;
    }
  },

};

export default AppConfig;
