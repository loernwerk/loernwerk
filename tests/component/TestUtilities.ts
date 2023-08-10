import { DOMWrapper, VueWrapper } from '@vue/test-utils';
import { FindComponentSelector } from '@vue/test-utils/dist/types';

/**
 * Find a component by its text description
 * @param wrapper VueWrapper to use
 * @param component component which should contain given text
 * @param text text content of the component
 * @returns component with text content
 */
export function findComponentByText(
    wrapper: VueWrapper,
    component: FindComponentSelector,
    text: string
): VueWrapper | undefined {
    return wrapper.findAllComponents(component).find((element) => {
        return element.text() === text;
    });
}

/**
 * Find a component by its text description
 * @param wrapper VueWrapper to use
 * @param selector selector of the component which should contain given text
 * @param text text content of the component
 * @returns component with text content
 */
export function findNodeByText<K extends keyof HTMLElementTagNameMap>(
    wrapper: VueWrapper,
    selector: keyof HTMLElementTagNameMap,
    text: string
): DOMWrapper<HTMLElementTagNameMap[K]> | undefined {
    const result = wrapper.findAll(selector).find((element) => {
        return element.text() === text;
    });

    if (result !== undefined) {
        return result as DOMWrapper<HTMLElementTagNameMap[K]>;
    }
    return undefined;
}
