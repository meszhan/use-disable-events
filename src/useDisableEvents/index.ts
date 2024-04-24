import {matchesSelectorAndParentsTo} from '../utils';

export interface DisableEventsArguments {
    /** 禁用的事件 */
    events?: Array<keyof React.DOMAttributes<HTMLDivElement>>;
    /** 排除的元素选择器 */
    exclude?: string[];
    /** 禁用内部事件的元素选择器 */
    disabledSelector?: string;
}

export const useDisableEvents = ({
    events = [],
    exclude = [],
    disabledSelector
}: DisableEventsArguments): {listeners: Record<string, (e: React.SyntheticEvent) => void>} => {
    const disableEvents = (e: React.SyntheticEvent) => {
        if (
            exclude.length &&
            exclude.every(
                selector =>
                    !matchesSelectorAndParentsTo(
                        e.target as Node,
                        selector,
                        disabledSelector ? document.querySelector(disabledSelector) : null
                    )
            )
        ) {
            e.stopPropagation();
        }
    };

    return {listeners: events.reduce((prev, cur) => ({...prev, [cur]: disableEvents}), {})};
};
