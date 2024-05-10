/**
 * Function to observe an HTML element for intersection with the viewport.
 *
 * @param {HTMLElement} params.node - The HTML element to observe.
 * @param {(intersected: boolean) => void} params.setIntersecting - The function to call when the intersection state changes.
 * @param {IntersectionObserverInit} [params.options] - The options for the IntersectionObserver.
 * @param {boolean} [params.triggerOnce=false] - Whether to stop observing once the element has intersected.
 *
 * @returns {() => void} A function that can be called to stop observing the element.
 */

export const observeElement = ({
	node,
	options,
	setIntersecting,
	triggerOnce = false
}: {
	node: HTMLElement;
	setIntersecting: (intersected: boolean) => void;
	options?: IntersectionObserverInit;
	triggerOnce?: boolean;
}): (() => void) => {
	if (!IntersectionObserver || !node) {
		setIntersecting(true);
		return () => {};
	}

	const observerCallback = (
		[entry]: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		setIntersecting(entry?.isIntersecting || false);
		if (entry?.isIntersecting && triggerOnce) {
			observer.unobserve(entry.target);
		}
	};

	const io = new IntersectionObserver(observerCallback, options);
	io.observe(node);

	return () => io.disconnect();
};
