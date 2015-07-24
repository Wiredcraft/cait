import React from 'react';
import _ from 'underscore';

import { Accordion, Panel } from 'react-bootstrap';


const CompanyAccordion = React.createClass({
    propTypes: {
        companies: React.PropTypes.array.isRequired,
        onDeselect: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        let companies = this.props.companies;
        return {
            activeKey: companies.length > 0 ? _.last(companies).id : null,
        };
    },

    componentWillReceiveProps(nextProps) {
        let oldIds = _.pluck(this.props.companies, 'id');
        let newIds = _.pluck(nextProps.companies, 'id');
        let diff = _.first(_.difference(newIds, oldIds));

        this.setState({
            activeKey: diff !== undefined ? diff : _.last(newIds),
        });
    },

    _handleSelect(key) {
        this.setState({
            activeKey: key,
        });
    },

    render() {
        let {companies, onDeselect} = this.props;

        return (
            <Accordion
                activeKey={this.state.activeKey}
                className='company-accordion'
                onSelect={this._handleSelect}
            >
                {companies.map(c => {
                    let header = (
                        <div>
                            {c.name}
                            <button
                                className='close pull-right'
                                onClick={onDeselect.bind(null, c.id)}>
                                &times;
                            </button>
                        </div>
                    );
                    return (
                        <Panel header={header} key={c.id} eventKey={c.id}>
                            <dl>
                                <dt>Country</dt>
                                <dd>{c.country}</dd>
                                <dt>Sector</dt>
                                <dd>{c.sector}</dd>
                                <dt>Revenue</dt>
                                <dd>${c.revenue}bn</dd>
                            </dl>
                        </Panel>
                    );
                })}
            </Accordion>
        );
    },
});


export default CompanyAccordion;
