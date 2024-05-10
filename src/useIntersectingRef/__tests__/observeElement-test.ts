import { renderHook } from '@testing-library/react-hooks';
import { observeElement } from '../observeElement';

describe('observeElement', () => {
	let node: HTMLElement;
	let setIntersecting: jest.Mock;
	let options: IntersectionObserverInit;
	let triggerOnce: boolean;
	let IntersectionObserver: IntersectionObserver;

	beforeEach(() => {
		// @ts-ignore
		({ IntersectionObserver } = window);
		node = document.createElement('div');
		setIntersecting = jest.fn();
		options = {};
		triggerOnce = false;
	});

	afterEach(() => {
		// @ts-ignore
		window.IntersectionObserver = IntersectionObserver;
	});

	it('should set intersecting to true and return a no-op function when IntersectionObserver is not available', () => {
		// @ts-ignore
		window.IntersectionObserver = undefined;

		const { result } = renderHook(() =>
			observeElement({ node, setIntersecting, options, triggerOnce })
		);

		expect(setIntersecting).toHaveBeenCalledWith(true);
		expect(typeof result.current).toBe('function');
	});

	it('should set intersecting to true and return a no-op function when node is not available', () => {
		// @ts-ignore
		node = null;

		const { result } = renderHook(() =>
			observeElement({ node, setIntersecting, options, triggerOnce })
		);

		expect(setIntersecting).toHaveBeenCalledWith(true);
		expect(typeof result.current).toBe('function');
	});

	it('should observe the node and disconnect when the returned function is called', () => {
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn().mockImplementation(() => ({
			observe,
			disconnect
		}));

		const { result } = renderHook(() =>
			observeElement({ node, setIntersecting, options, triggerOnce })
		);

		expect(observe).toHaveBeenCalledWith(node);
		expect(typeof result.current).toBe('function');

		result.current();

		expect(disconnect).toHaveBeenCalled();
	});

	it('should stop observing the node when it intersects and triggerOnce is true', () => {
		const unobserve = jest.fn();

		window.IntersectionObserver = jest.fn().mockImplementation(callback => {
			callback([{ isIntersecting: true, target: node } as any], { unobserve } as any);
			return { observe: jest.fn(), disconnect: jest.fn() };
		});
		triggerOnce = true;

		renderHook(() => observeElement({ node, setIntersecting, options, triggerOnce }));

		expect(unobserve).toHaveBeenCalledWith(node);
	});
});
