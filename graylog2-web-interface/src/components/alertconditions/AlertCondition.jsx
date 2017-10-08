import React from 'react';
import Reflux from 'reflux';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import CombinedProvider from 'injection/CombinedProvider';
const { AlertConditionsActions, AlertConditionsStore } = CombinedProvider.get('AlertConditions');
const { CurrentUserStore } = CombinedProvider.get('CurrentUser');

import { AlertConditionSummary, UnknownAlertCondition } from 'components/alertconditions';
import PermissionsMixin from 'util/PermissionsMixin';

const AlertCondition = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object,
  },
  mixins: [Reflux.connect(AlertConditionsStore), Reflux.connect(CurrentUserStore), PermissionsMixin],

  _onDelete() {
    if (window.confirm('确定删除告警条件?')) {
      AlertConditionsActions.delete(this.props.stream.id, this.props.alertCondition.id);
    }
  },

  render() {
    const type = this.props.alertCondition.type;
    const stream = this.props.stream;
    const condition = this.props.alertCondition;
    const typeDefinition = this.state.types[type];

    if (!typeDefinition) {
      return <UnknownAlertCondition alertCondition={condition} onDelete={this._onDelete} stream={stream} />;
    }

    const permissions = this.state.currentUser.permissions;
    let actions = [];
    if (this.isPermitted(permissions, `streams:edit:${stream.id}`)) {
      actions = [
        <DropdownButton key="more-actions-button" title="操作" pullRight
                        id={`more-actions-dropdown-${condition.id}`}>
          <MenuItem onSelect={this._onDelete}>删除</MenuItem>
        </DropdownButton>,
      ];
    }

    return (
      <AlertConditionSummary alertCondition={condition} typeDefinition={typeDefinition} stream={stream}
                             actions={actions} linkToDetails />
    );
  },
});

export default AlertCondition;
