import React from 'react';
import Immutable from 'immutable';
import { Row, Col } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const DashboardsStore = StoreProvider.getStore('Dashboards');

import DocsHelper from 'util/DocsHelper';
import PermissionsMixin from 'util/PermissionsMixin';

import DocumentationLink from 'components/support/DocumentationLink';
import Spinner from 'components/common/Spinner';
import PageHeader from 'components/common/PageHeader';
import DashboardList from './DashboardList';
import EditDashboardModalTrigger from './EditDashboardModalTrigger';

const DashboardListPage = React.createClass({
  propTypes: {
    permissions: React.PropTypes.arrayOf(React.PropTypes.string),
  },
  mixins: [PermissionsMixin],
  getInitialState() {
    return {
      dashboardsLoaded: false,
      dashboards: DashboardsStore.dashboards,
      filteredDashboards: Immutable.List(),
    };
  },
  componentDidMount() {
    DashboardsStore.addOnDashboardsChangedCallback(this._onDashboardsChange);
    DashboardsStore.updateDashboards();
  },
  _onDashboardsChange(dashboards) {
    if (!this.isMounted()) {
      return;
    }
    if (dashboards) {
      this.setState({ dashboards: dashboards, filteredDashboards: dashboards, dashboardsLoaded: true });
    } else {
      this.setState({ dashboardsLoaded: false });
    }
  },
  render() {
    const createDashboardButton = this.isPermitted(this.props.permissions, ['dashboards:create']) ?
      <EditDashboardModalTrigger action="create" buttonClass="btn-success btn-lg" /> : null;

    const pageHeader = (
      <PageHeader title="显示面板">
        <span>
		  使用显示面板来创建一个特定的视图。可以在这里创建一个新的显示面板并且将在其他地方创建的图形和
		  图表加入进来。
        </span>

        <span>
		  可以添加搜索页面的任意组件到面板!
        </span>

        {createDashboardButton}
      </PageHeader>
    );

    if (!this.state.dashboardsLoaded) {
      return (
        <div>
          {pageHeader}

          <Row className="content">
            <div style={{ marginLeft: 10 }}><Spinner /></div>
          </Row>
        </div>
      );
    }

    let dashboardList;

    if (this.state.dashboards && this.state.dashboards.count() > 0 && this.state.filteredDashboards.isEmpty()) {
      dashboardList = <div>没有显示面板符合你的筛选条件</div>;
    } else {
      dashboardList = (
        <DashboardList dashboards={this.state.filteredDashboards}
                       onDashboardAdd={this._onDashboardAdd}
                       permissions={this.props.permissions} />
      );
    }

    return (
      <div>
        {pageHeader}

        <Row className="content">
          <Col md={12}>
            {dashboardList}
          </Col>
        </Row>
      </div>
    );
  },
});

export default DashboardListPage;
