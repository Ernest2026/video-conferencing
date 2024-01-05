import * as React from 'react';
import { mergeProps as mergePropsReactAria } from './mergeProps';
import { log } from '@livekit/components-core';

/** @internal */
export function isProp<U extends HTMLElement, T extends React.HTMLAttributes<U>>(
    prop: T | undefined,
): prop is T {
    return prop !== undefined;
}

/** @internal */
export function mergeProps<
    U extends HTMLElement,
    T extends Array<React.HTMLAttributes<U> | undefined>,
>(...props: T) {
    return mergePropsReactAria(...props.filter(isProp));
}

/** @internal */
export function cloneSingleChild(
    children: React.ReactNode | React.ReactNode[],
    props?: Record<string, any>,
    key?: any,
) {
    return React.Children.map(children, (child) => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (React.isValidElement(child) && React.Children.only(children)) {
            return React.cloneElement(child, { ...props, key });
        }
        return child;
    });
}

/**
 * @internal
 */
export function warnAboutMissingStyles(el?: HTMLElement) {
    // @ts-ignore
    if (
       // @ts-ignore
        (process?.env?.NODE_ENV === 'dev' || process?.env?.NODE_ENV === 'development') &&
        typeof window !== 'undefined'
    ) {
        const target = el ?? document.querySelector('.lk-room-container');
        if (target && !getComputedStyle(target).getPropertyValue('--lk-has-imported-styles')) {
            log.warn(
                "It looks like you're not using the `@livekit/components-styles package`. To render the UI with the default styling, please import it in your layout or page.",
            );
        }
    }
}