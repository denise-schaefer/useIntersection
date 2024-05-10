import { useCallback, useState } from 'react';
import { observeElement } from './observeElement';

/**
 * A React hook that returns a ref callback and a state indicating whether the element is intersecting.
 * The ref callback should be passed to the element that needs to be observed for intersection.
 * The intersected state will be updated based on whether the element is intersecting or not.
 *
 * @template T The type of the HTML element that the ref will be attached to.
 * @returns An object containing the intersected state and the ref callback.
 */
export function useIntersectingRef<T extends HTMLElement>() {
	// State to store whether the element is intersecting or not.
	const [intersected, setIntersecting] = useState(false);

	// Ref callback that will be passed to the element to be observed.
	// When the callback is invoked with a node, it starts observing the node for intersection.
	// When the callback is invoked without a node, it stops observing the previous node.
	const ref = useCallback((node: T) => {
		const cleanUp = node ? observeElement({ node, setIntersecting }) : () => {};
		if (!node) {
			// Clean up the observer when the node is removed on unmount
			cleanUp();
		}
	}, []);

	// Return the intersected state and the ref callback.
	return { intersected, ref };
}
