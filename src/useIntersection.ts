import { useCallback, useState } from 'react';

type UseIntersectionProperties<T> = {
	// The options for the IntersectionObserver.
	options?: IntersectionObserverInit;
	// Whether to stop observing after the first intersection.
	triggerOnce?: boolean;
};

type UseIntersectionResult<T> = {
	// Indicates whether an element is observed (default: `true`).
	intersecting: boolean;
	// The reference to the DOM element to observe.
	elementRef: (node: T | null) => void;
}

type CreateIntersectionObserverProps<T> = UseIntersectionProperties<T> & {
	intersectingStateChanger: (intersecting: boolean) => void,
};

const createIntersectionObserver = <T extends HTMLElement>({ triggerOnce, options, intersectingStateChanger }: CreateIntersectionObserverProps<T>) => {
	if (IntersectionObserver === undefined) {
		intersectingStateChanger(true);
	}

	const observerCallback = (
		[entry]: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		intersectingStateChanger(entry?.isIntersecting || false);
		if (entry?.isIntersecting && triggerOnce) {
			observer.unobserve(entry.target);
		}
	};

	let io: IntersectionObserver | null = new IntersectionObserver(observerCallback, options);

	return (element: T | null) => {
		if (element) {
			io?.observe(element)
		} else {
			io?.disconnect();
			io = null;
		}
	}
}

/**
 * A custom hook that uses the IntersectionObserver API to observe a DOM element.
 * @function useIntersection
 * @param {UseIntersectionProperties<T extends Element>} { ref, options, triggerOnce = false } - The properties for the hook.
 * @returns {Object} An object with a single property, intersecting, which is true if the element is intersecting.
 */
export const useIntersection = <T extends HTMLElement>({
														   options,
														   triggerOnce = false
													   }: UseIntersectionProperties<T>): UseIntersectionResult<T> => {
	const [intersecting, setIntersecting] = useState(false);

	/**
	 * The callback hook that sets up the IntersectionObserver.
	 */
	const elementRef = useCallback((element: T | null) => createIntersectionObserver<T>({
		triggerOnce,
		options,
		intersectingStateChanger: setIntersecting
	})(element), [options, triggerOnce])

	return { intersecting, elementRef };
};
