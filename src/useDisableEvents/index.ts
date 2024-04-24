import {useCallback, useMemo} from 'react';

import {matchesSelectorAndParentsTo} from '../utils';

export interface DisableEventsArguments {
    /** 事件禁用的最顶层容器，不传表示一直到根节点 */
    disabledContainer?: string | HTMLElement;
    /** 禁用的事件列表 */
    events?: Array<Exclude<keyof React.DOMAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'>>;
    /** 容器内不禁用事件的元素选择器 */
    exclude?: string[];
}

export const useDisableEvents = ({events = [], exclude = [], disabledContainer}: DisableEventsArguments = {}): {
    listeners: Record<string, (e: React.SyntheticEvent) => void>;
} => {
    const baseNode = useMemo<Node | null>(() => {
        if (disabledContainer) {
            if (typeof disabledContainer === 'string') {
                return document.querySelector(disabledContainer);
            }
            return disabledContainer;
        }
        return null;
    }, [disabledContainer]);

    const disableEvents = useCallback(
        (e: React.SyntheticEvent) => {
            if (
                exclude.length &&
                exclude.every(selector => !matchesSelectorAndParentsTo(e.target as Node, selector, baseNode))
            ) {
                e.stopPropagation();
            }
        },
        [exclude, baseNode]
    );

    return useMemo(
        () => ({listeners: Object.assign({}, ...events.map(event => ({[event]: disableEvents})))}),
        [events, disableEvents]
    );
};
