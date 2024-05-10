import { renderHook } from '@testing-library/react-hooks';
import { useIntersectingRef } from '../useIntersectingRef';
import clearAllMocks = jest.clearAllMocks;

const mockObserveElement = jest.fn();
jest.mock('../observeElement', () => ({
	observeElement: () => mockObserveElement()
}));

describe('useIntersectingRef', () => {
	afterEach(clearAllMocks);
	it('should return intersected as false initially', () => {
		const { result } = renderHook(() => useIntersectingRef());

		expect(result.current.intersected).toBe(false);
	});

	it('should return a ref callback function', () => {
		const { result } = renderHook(() => useIntersectingRef());

		expect(typeof result.current.ref).toBe('function');
	});

	it('should call observeElement when ref callback is invoked with a node', () => {
		const { result } = renderHook(() => useIntersectingRef());

		result.current.ref(document.createElement('div'));

		expect(mockObserveElement).toHaveBeenCalled();
	});

	it('should not call observeElement when ref callback is invoked without a node', () => {
		const { result } = renderHook(() => useIntersectingRef());

		// @ts-ignore, force null for test
		result.current.ref(null);

		expect(mockObserveElement).not.toHaveBeenCalled();
	});
});
