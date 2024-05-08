import { MutableRefObject, RefObject, useEffect, useState } from 'react';

type UseIntersectionProperties<T> = {
	ref: MutableRefObject<T> | RefObject<T>;
	options?: IntersectionObserverInit;
	triggerOnce?: boolean;
};

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

	useEffect(() => {
		const element = ref?.current;

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

		if (element) {
			io.observe(element);
		}

		return () => {
			io?.disconnect();
			io = null;
		};
	}, [ref, options, triggerOnce]);

	return { intersecting };
};
