import { renderHook, act } from '@testing-library/react-hooks';
import { useIntersection } from '../useIntersection';

describe('useIntersection', () => {
	let observerMock: jest.Mock<any, any, any>;

	const setUp = () => {
		const observe = jest.fn();
		const unobserve = jest.fn();
		const disconnect = jest.fn();

		function mockObserver(this: any, callback: any) {
			this.observe = observe;
			this.unobserve = unobserve;
			this.callback = callback;
			this.disconnect = disconnect;
		}
		window.IntersectionObserver = jest.fn().mockImplementation(mockObserver);
		observerMock = window.IntersectionObserver as jest.Mock;

		return { observe, unobserve, disconnect };
	};

	const cleanUp = () => {
		jest.clearAllMocks();
	};

	afterEach(cleanUp);

	it('should observe element on mount', () => {
		const { observe } = setUp();
		const ref = { current: document.createElement('div') };
		renderHook(() => useIntersection({ ref }));

		expect(observe).toHaveBeenCalledWith(ref.current);
	});

	it('should unobserve element when intersecting and triggerOnce is true', () => {
		const { unobserve } = setUp();
		const ref = { current: document.createElement('div') };
		renderHook(() => useIntersection({ ref, triggerOnce: true }));

		act(() => {
			observerMock.mock.calls[0][0](
				[{ isIntersecting: true, target: ref.current }],
				observerMock.mock.instances[0]
			);
		});

		expect(unobserve).toHaveBeenCalledWith(ref.current);
	});

	it('should not unobserve element when intersecting and triggerOnce is false', () => {
		const { unobserve } = setUp();
		const ref = { current: document.createElement('div') };
		renderHook(() => useIntersection({ ref }));

		act(() => {
			observerMock.mock.calls[0][0](
				[{ isIntersecting: true, target: ref.current }],
				observerMock.mock.instances[0]
			);
		});

		expect(unobserve).not.toHaveBeenCalled();
	});

	it('should disconnect observer on unmount', () => {
		const { disconnect } = setUp();
		const ref = { current: document.createElement('div') };
		const { unmount } = renderHook(() => useIntersection({ ref }));

		unmount();

		expect(disconnect).toHaveBeenCalled();
	});

	it('allow intersecting if no IntersectionObserver is available', () => {
		window.IntersectionObserver = undefined as never
		const ref = { current: document.createElement('div') };
		const { result } = renderHook(() => useIntersection({ ref }));

		expect(result.current).toBeTruthy()
	});
});
