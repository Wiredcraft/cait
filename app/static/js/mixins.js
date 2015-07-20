'use strict';

import _ from 'underscore';


var WindowResizeMixin = {
    getInitialState() {
        return {windowWidth: window.innerWidth};
    },

    componentWillMount() {
        this.resizeTimeout = null;
    },

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    },

    onWindowResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(this.handleResize, 300);
    },

    handleResize() {
        this.setState({windowWidth: window.innerWidth});
        if (_.isFunction(this._handleResize)) {
            this._handleResize(window.innerWidth);
        }
    }
};


export { WindowResizeMixin };
