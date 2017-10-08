import React from 'react';

import GrokPatterns from 'components/grok-patterns/GrokPatterns';
import { DocumentTitle } from 'components/common';

const GrokPatternsPage = React.createClass({
  render() {
    return (
      <DocumentTitle title="Grok 模式">
        <GrokPatterns />
      </DocumentTitle>
    );
  },
});

export default GrokPatternsPage;
