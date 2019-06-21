/* global IS_OWKESTRA */
import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';
import {noop} from 'lodash';
import {
    RoundedButton,
    DownloadSimple,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    colors,
} from '@substrafoundation/substra-ui';

import Description from '../../../../../../common/components/detail/components/description';

import {spacingNormal} from '../../../../../../../../../assets/css/variables/spacing';

const owkestraColors = IS_OWKESTRA ? colors.darkSkyBlue : colors.tealish;

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const AlgoTabs = ({
descLoading, item, tabIndex, setTabIndex, downloadFile,
}) => (
    <Tabs
        selectedIndex={tabIndex}
        onSelect={setTabIndex}
    >
        <TabList>
            <Tab color={owkestraColors}>Description</Tab>
            <Tab color={owkestraColors}>Code</Tab>
        </TabList>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            <Span>The algorithm's source code and Dockerfile are packaged within a zip or tar.gz file.</Span>
            <RoundedButton Icon={DownloadSimple} onClick={downloadFile}>
                Download algo
            </RoundedButton>
        </TabPanel>
    </Tabs>
);


AlgoTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
    downloadFile: PropTypes.func.isRequired,
};

AlgoTabs.defaultProps = {
    item: null,
    descLoading: false,
    tabIndex: 0,
    setTabIndex: noop,
};

export default AlgoTabs;
