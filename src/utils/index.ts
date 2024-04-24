const isFunction: (func: any) => boolean = (func: any) => {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
};

let matchesSelectorFunc: keyof Element | undefined;

type IFunc = (params: string) => boolean;

const matchesSelector: (el: Element, selector: string) => boolean = (el: Element, selector: string) => {
    if (!matchesSelectorFunc) {
        matchesSelectorFunc = (
            [
                'matches',
                'webkitMatchesSelector',
                'mozMatchesSelector',
                'msMatchesSelector',
                'oMatchesSelector'
            ] as Array<keyof Element>
        ).find(touch => isFunction(el[touch]));
    }

    if (!matchesSelectorFunc || !isFunction(el[matchesSelectorFunc])) {
        return false;
    }

    return (el[matchesSelectorFunc] as IFunc)(selector);
};

// 判断拖拽目标元素(e.target)是否在手柄元素内部
const matchesSelectorAndParentsTo: (el: Node, selector: string, baseNode: Node | null) => boolean = (
    el: Node,
    selector: string,
    baseNode: Node | null
) => {
    let node: Node | null = el;

    do {
        if (matchesSelector(node as Element, selector)) {
            return true;
        }
        if (node === baseNode) {
            return false;
        }
        node = node.parentNode;
    } while (node);

    return false;
};

export {matchesSelector, matchesSelectorAndParentsTo};
