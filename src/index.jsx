import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteTree from 'infinite-tree';

const lcfirst = (str) => {
    str += '';
    return str.charAt(0).toLowerCase() + str.substr(1);
};

module.exports = class extends React.Component {
    tree = null;

    eventHandlers = {
        onUpdate: null,
        onOpenNode: null,
        onCloseNode: null,
        onSelectNode: null,
        onDropNode: null,
        onScrollProgress: null
    };

    componentDidMount() {
        const { children, className, ...options } = this.props;

        const el = ReactDOM.findDOMNode(this);
        options.el = el;

        this.tree = new InfiniteTree(options);

        Object.keys(this.eventHandlers).forEach(key => {
            if (!this.props[key]) {
                return;
            }

            const eventName = lcfirst(key.substr(2)); // e.g. onUpdate -> update
            this.eventHandlers[key] = this.props[key];
            this.tree.on(eventName, this.eventHandlers[key]);
        });
    }
    componentWillUnmount() {
        Object.keys(this.eventHandlers).forEach(key => {
            if (!this.eventHandlers[key]) {
                return;
            }

            const eventName = lcfirst(key.substr(2)); // e.g. onUpdate -> update
            this.tree.off(eventName, this.eventHandlers[key]);
            this.eventHandlers[key] = null;
        });

        this.tree.destroy();
        this.tree = null;
    }
    render() {
        return (
            <div className={this.props.className}>{this.props.children}</div>
        );
    }
};