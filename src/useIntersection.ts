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
	const elementRef = useCallback((element: T | null) => {
		if (IntersectionObserver === undefined) {
			!intersecting && setIntersecting(true);
		}

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

		let io: IntersectionObserver | null = new IntersectionObserver(observerCallback, options);
		/**
		 * The cleanup function for the effect hook.
		 * Disconnects the IntersectionObserver.
		 */
		const cleanUp = () => {
			io?.disconnect();
			io = null;
		}

		if(!element) {
			cleanUp()
			return;
		}

		io.observe(element);
	}, [options, triggerOnce])

	return { intersecting, elementRef };
};
