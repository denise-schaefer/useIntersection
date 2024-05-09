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
		const element =  document.createElement('div')
		const { result } = renderHook(() => useIntersection({}));

		act(() => {
			result.current.elementRef(element)
		})

		expect(observe).toHaveBeenCalledWith(element);
	});

	it('should unobserve element when intersecting and triggerOnce is true', () => {
		const { unobserve } = setUp();
		const element =  document.createElement('div')
		const { result } = renderHook(() => useIntersection({ triggerOnce: true }));

		act(() => {
			result.current.elementRef(element)

			observerMock.mock.calls[0][0](
				[{ isIntersecting: true, target: element }],
				observerMock.mock.instances[0]
			);
		});

		expect(unobserve).toHaveBeenCalledWith(element);
	});

	it('should not unobserve element when intersecting and triggerOnce is false', () => {
		const { unobserve } = setUp();
		const element =  document.createElement('div')
		const { result } = renderHook(() => useIntersection({}));

		act(() => {
			result.current.elementRef(element)

			observerMock.mock.calls[0][0](
				[{ isIntersecting: true, target: element }],
				observerMock.mock.instances[0]
			);
		});

		expect(unobserve).not.toHaveBeenCalled();
	});

	it('disconnects the observer on destroying reference to the element', () => {
		const { disconnect } = setUp();
		const { result } = renderHook(() => useIntersection({}));

		act(() => {
			result.current.elementRef(null)
		})

		expect(disconnect).toHaveBeenCalled();
	});
});
