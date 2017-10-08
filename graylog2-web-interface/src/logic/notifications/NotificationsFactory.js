import React from 'react';
import { Link } from 'react-router';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';
import DocumentationLink from 'components/support/DocumentationLink';

class NotificationsFactory {
  static getForNotification(notification) {
    switch (notification.type) {
      case 'check_server_clocks':
        return {
          title: '检查服务器节点时钟.',
          description: (
            <span>
              一个服务器节点启动后失效.
              这通常以诶这系统时间出错，比如 NTP. 请确保系统节点的同步性.
            </span>
          ),
        };
      case 'deflector_exists_as_index':
        return {
          title: '索引存在导流流并且是一个别称.',
          description: (
            <span>
              导流器通常意味着别称，但是却以索引方式存在. 很多情况会导致该结果. 您的消息仍然会被索引，但是维护和
              生产数据将会不正确.请采取对应措施.
            </span>
          ),
        };
      case 'email_transport_configuration_invalid':
        return {
          title: 'Email传输配置丢失或无效!',
          description: (
            <span>
              Email配置子系统显示配置丢失或者无效. 请检查相关配置文件. 详细信息: {notification.details.exception}
            </span>
          ),
        };
      case 'email_transport_failed':
        return {
          title: '发送邮件失败!',
          description: (
            <span>
              系统在发送邮件时出错. 详细信息: {notification.details.exception}
            </span>
          ),
        };
      case 'es_cluster_red':
        return {
          title: 'Elasticsearch 集群告警 (RED)',
          description: (
            <span>
              Elasticsearch集群状态为告警. 这一围着分片未被指定. 这通常意味着集群节点错误. 系统会创建日志.
            </span>
          ),
        };
      case 'es_open_files':
        return {
          title: 'Elasticsearch nodes with too low open file limit',
          description: (
            <span>
              Elasticsearch 节点打开文件句柄有限制: (当前限制:{' '}
              <em>{notification.details.max_file_descriptors}</em> 在 <em>{notification.details.hostname}</em>;
              一般至少要 64000) 这样会导致分析困难.
            </span>
          ),
        };
      case 'es_unavailable':
        return {
          title: 'Elasticsearch 集群不可达',
          description: (
            <span>
              无法连接Elasticsearch 集群. 如果您在使用广播, 请检查您的网络状态并且检查Elasticsearch是否可达.
              并且检查集群名称是否正确.
            </span>
          ),
        };
      case 'gc_too_long':
        return {
          title: '节点垃圾回收机制过长',
          description: (
            <span>
              节点垃圾回收时间过长. 垃圾回收时间应当很短, 请检查节点状态.
              (节点: <em>{notification.node_id}</em>, 垃圾回收时间: <em>{notification.details.gc_duration_ms} ms</em>,
              GC 临界值: <em>{notification.details.gc_threshold_ms} 毫秒</em>)
            </span>
          ),
        };
      case 'generic':
        return {
          title: notification.details.title,
          description: notification.details.description,
        };
      case 'index_ranges_recalculation':
        return {
          title: '需要重新计算索引范围',
          description: (
            <span>
              索引范围未更新. 请前往 系统/分片 并且触发索引范围重新计算, 该操作可以在
              维护目录操作, 请更新{notification.details.index_sets ? (`以下索引集: ${notification.details.index_sets}`) : '索引索引集'}
            </span>
          ),
        };
      case 'input_failed_to_start':
        return {
          title: '输入启动失败',
          description: (
            <span>
              输入 {notification.details.input_id} 启动失败, 在节点 {notification.node_id}. 可能原因:
              »{notification.details.reason}«. 这意味着您将无法从该输入接收消息.
              这通常意味着错误的配置或者服务器错误, 点击 {' '}
              <Link to={Routes.SYSTEM.INPUTS}>这里</Link> 解决该问题.
            </span>
          ),
        };
      case 'journal_uncommitted_messages_deleted':
        return {
          title: '日志文件删除未提交的消息',
          description: (
            <span>
              一些消息被日志文件删除当他们还未被写入Elasticsearch. 请
              验证您的Elasticsearch 集群 状态. 您也可以检查日志配置并且设定到一个更高的值. (节点: <em>{notification.node_id}</em>)
            </span>
          ),
        };
      case 'journal_utilization_too_high':
        return {
          title: '日志使用量过高',
          description: (
            <span>
              日志使用量过高, 很快就会达到上限. 请检查您的Elasticsearch 集群
              状态. 您也可以检查日志配置并且设定到一个更高的值.
              (节点: <em>{notification.node_id}</em>)
            </span>
          ),
        };
      case 'multi_master':
        return {
          title: '集群中有多个主节点',
          description: (
            <span>
              日志集群中有多个节点被配置为主节点. 集群会将新的节点指定为辅助节点如果已存在主节点. 您应当处理该情况,
              检查每个节点的graylog.conf 并且确保只有一个节点是主节点. 处理后可关闭该通知.
            </span>
          ),
        };
      case 'no_input_running':
        return {
          title: '有节点没有运行输入',
          description: (
            <span>
              有一个节点没有运行任何输入. 这意味着该节点没有在接收消息. 这通常是因为您还没有配置输入或者配置出错.
              请参考<Link to={Routes.SYSTEM.INPUTS}>这里</Link>.
            </span>
          ),
        };
      case 'no_master':
        return {
          title: '集群中没有服务器主节点.',
          description: (
            <span>
              一些特定操作需要集群中存在主节点, 但是本系统中没有发现主节点.
              请确保日志服务器系统配置文件中设置了 <code>is_master = true</code>. 除非该问题解决, 所有保留机制才会生效.
              一些web接口页面(比如面板)可能无法使用.
            </span>
          ),
        };
      case 'outdated_version':
        return {
          title: '有新的xxxx 日志平台版本可用.',
          description: (
            <span>
              最新的版本是 <em>{notification.details.current_version}</em>, 当前为稳定版.
            </span>
          ),
        };
      case 'output_disabled':
        return {
          title: '输出被禁用',
          description: (
            <span>
              输出 {notification.details.outputId} 在数据流 "{notification.details.streamTitle}"
              (id: {notification.details.streamId}) 中被禁用了 {notification.details.faultPenaltySeconds}
              秒, 因为存在 {notification.details.faultCount} 个失败.
              (节点: <em>{notification.node_id}</em>, 错误阈值: <em>{notification.details.faultCountThreshold}</em>)
            </span>
          ),
        };
      case 'stream_processing_disabled':
        return {
          title: '数据流处理被禁用，原因是过长的处理时间.',
          description: (
            <span>
              数据流 <em>{notification.details.stream_id}</em> 处理花费了{' '}
              {notification.details.fault_count} 时间. 为了维护消息处理的稳定性, 数据流处理被禁用.
            </span>
          ),
        };
      default:
        return { title: `未知 (${notification.type})`, description: '未知' };
    }
  }
}

export default NotificationsFactory;
