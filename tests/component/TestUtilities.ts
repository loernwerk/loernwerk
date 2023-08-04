import { VueWrapper } from '@vue/test-utils';
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
