import {isArray} from 'lodash';

import List from '../../../../common/components/list';

// update addNotification, more
class DatasetList extends List {
    addNotification = (key, text) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, itemResults, logCopyFromList} = this.props;

        const item = itemResults.find(x => x.key === this.state.popover.item.key);

        if (item) {
            const inputValue = isArray(item[key]) ? JSON.stringify(item[key]) : item[key];
            addNotification(inputValue, text);
            logCopyFromList(this.state.popover.item.key);
        }

        this.popoverHandleClose();
    };

    more = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {fetchItem, itemResults} = this.props;

        const item = itemResults.find(x => x.key === o.key);

        // load item for getting data keys
        if (!item) {
            fetchItem({key: o.key});
        }

        // display menu
        this.setState({
            popover: {
                open: true,
                anchorEl: e.currentTarget,
                item: o,
            },
        });
        e.persist();
    };
}

export default DatasetList;
