import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';
import {
  GraphVisualization,
  HistogramVisualization,
  NumericVisualization,
  QuickValuesVisualization,
  StackedGraphVisualization } from 'components/visualizations';
import {
  CountWidgetCreateConfiguration,
  CountWidgetEditConfiguration,
  FieldChartWidgetConfiguration,
  QuickValuesWidgetCreateConfiguration,
  QuickValuesWidgetEditConfiguration,
  StackedChartWidgetConfiguration,
  StatisticalCountWidgetCreateConfiguration,
  StatisticalCountWidgetEditConfiguration } from 'components/widgets/configurations';

PluginStore.register(new PluginManifest({}, {
  widgets: [
    {
      type: 'SEARCH_RESULT_COUNT',
      displayName: '查找结果数',
      defaultHeight: 1,
      defaultWidth: 1,
      visualizationComponent: NumericVisualization,
      configurationCreateComponent: CountWidgetCreateConfiguration,
      configurationEditComponent: CountWidgetEditConfiguration,
    },
    {
      type: 'STREAM_SEARCH_RESULT_COUNT',
      displayName: '数据流搜索结果统计',
      defaultHeight: 1,
      defaultWidth: 1,
      visualizationComponent: NumericVisualization,
      configurationCreateComponent: CountWidgetCreateConfiguration,
      configurationEditComponent: CountWidgetEditConfiguration,
    },
    {
      type: 'STATS_COUNT',
      displayName: '统计值',
      defaultHeight: 1,
      defaultWidth: 1,
      visualizationComponent: NumericVisualization,
      configurationCreateComponent: StatisticalCountWidgetCreateConfiguration,
      configurationEditComponent: StatisticalCountWidgetEditConfiguration,
    },
    {
      type: 'SEARCH_RESULT_CHART',
      displayName: '搜索结果图',
      defaultHeight: 1,
      defaultWidth: 2,
      visualizationComponent: HistogramVisualization,
    },
    {
      type: 'QUICKVALUES',
      displayName: '快速统计值',
      defaultHeight: 3,
      defaultWidth: 1,
      visualizationComponent: QuickValuesVisualization,
      configurationCreateComponent: QuickValuesWidgetCreateConfiguration,
      configurationEditComponent: QuickValuesWidgetEditConfiguration,
    },
    {
      type: 'FIELD_CHART',
      displayName: '字段图',
      defaultHeight: 1,
      defaultWidth: 2,
      visualizationComponent: GraphVisualization,
      configurationEditComponent: FieldChartWidgetConfiguration,
    },
    {
      type: 'STACKED_CHART',
      displayName: '堆积图',
      defaultHeight: 1,
      defaultWidth: 2,
      visualizationComponent: StackedGraphVisualization,
      configurationEditComponent: StackedChartWidgetConfiguration,
    },
  ],
}));
