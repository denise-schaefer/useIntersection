import { MutableRefObject, RefObject, useEffect, useState } from 'react';

type UseIntersectionProperties<T> = {
	// The reference to the DOM element to observe.
	ref: MutableRefObject<T> | RefObject<T>;
	// The options for the IntersectionObserver.
	options?: IntersectionObserverInit;
	// Whether to stop observing after the first intersection.
	triggerOnce?: boolean;
};

/**
 * A custom hook that uses the IntersectionObserver API to observe a DOM element.
 * @function useIntersection
 * @param {UseIntersectionProperties<T extends Element>} { ref, options, triggerOnce = false } - The properties for the hook.
 * @returns {Object} An object with a single property, intersecting, which is true if the element is intersecting.
 */
export const useIntersection = <T extends HTMLElement>({
	ref,
	options,
	triggerOnce = false
}: UseIntersectionProperties<T>): {
	intersecting: boolean;
} => {
	const [intersecting, setIntersecting] = useState(false);
	if (IntersectionObserver === undefined) {
		!intersecting && setIntersecting(true);
	}

	/**
	 * The effect hook that sets up the IntersectionObserver.
	 */
	useEffect(() => {
		const element = ref.current;

		/**
		 * The callback for the IntersectionObserver.
		 * @param {IntersectionObserverEntry[]} [entry] - The entries for the IntersectionObserver.
		 * @param {IntersectionObserver} observer - The IntersectionObserver instance.
		 */
		const observerCallback = (
			[entry]: IntersectionObserverEntry[],
			observer: IntersectionObserver
		) => {
			setIntersecting(entry?.isIntersecting || false);
			if (entry?.isIntersecting && triggerOnce) {
				observer.unobserve(entry.target);
			}
		};

		const io: IntersectionObserver = new IntersectionObserver(observerCallback, options);

		if (element) {
			io.observe(element);
		}

		/**
		 * The cleanup function for the effect hook.
		 * Disconnects the IntersectionObserver.
		 */
		return () => {
			io?.disconnect();
		};
	}, [ref, options, triggerOnce]);

	return { intersecting };
};
