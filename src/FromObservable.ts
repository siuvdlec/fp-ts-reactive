/**
 * Lift a computation from the `Observable` monad
 *
 * @since 0.6.12
 */
import { Chain, Chain1, Chain2, Chain2C, Chain3, Chain3C, Chain4, chainFirst } from 'fp-ts/Chain'
import type { FromTask, FromTask1, FromTask2, FromTask2C, FromTask3, FromTask3C, FromTask4 } from 'fp-ts/FromTask'
import { flow } from 'fp-ts/function'
// eslint-disable-next-line fp-ts/no-lib-imports
import type { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/lib/HKT'
import type { Observable } from 'rxjs'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable<F> extends FromTask<F> {
    readonly fromObservable: <A>(fa: Observable<A>) => HKT<F, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable1<F extends URIS> extends FromTask1<F> {
    readonly fromObservable: <A>(fa: Observable<A>) => Kind<F, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable2<F extends URIS2> extends FromTask2<F> {
    readonly fromObservable: <A, E>(fa: Observable<A>) => Kind2<F, E, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable2C<F extends URIS2, E> extends FromTask2C<F, E> {
    readonly fromObservable: <A>(fa: Observable<A>) => Kind2<F, E, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable3<F extends URIS3> extends FromTask3<F> {
    readonly fromObservable: <A, R, E>(fa: Observable<A>) => Kind3<F, R, E, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable3C<F extends URIS3, E> extends FromTask3C<F, E> {
    readonly fromObservable: <A, R>(fa: Observable<A>) => Kind3<F, R, E, A>
}

/**
 * @category model
 * @since 0.6.12
 */
export interface FromObservable4<F extends URIS4> extends FromTask4<F> {
    readonly fromObservable: <A, S, R, E>(fa: Observable<A>) => Kind4<F, S, R, E, A>
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export function fromObservableK<F extends URIS4>(
    F: FromObservable4<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => <S, R, E>(...a: A) => Kind4<F, S, R, E, B>
export function fromObservableK<F extends URIS3>(
    F: FromObservable3<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => <R, E>(...a: A) => Kind3<F, R, E, B>
export function fromObservableK<F extends URIS3, E>(
    F: FromObservable3C<F, E>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => <R>(...a: A) => Kind3<F, R, E, B>
export function fromObservableK<F extends URIS2>(
    F: FromObservable2<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => <E>(...a: A) => Kind2<F, E, B>
export function fromObservableK<F extends URIS2, E>(
    F: FromObservable2C<F, E>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => (...a: A) => Kind2<F, E, B>
export function fromObservableK<F extends URIS>(
    F: FromObservable1<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => (...a: A) => Kind<F, B>
export function fromObservableK<F>(
    F: FromObservable<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => (...a: A) => HKT<F, B>
export function fromObservableK<F>(
    F: FromObservable<F>
): <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Observable<B>) => (...a: A) => HKT<F, B> {
    return f => flow(f, F.fromObservable)
}

/**
 * @since 0.6.12
 */
export function chainObservableK<M extends URIS4>(
    F: FromObservable4<M>,
    M: Chain4<M>
): <A, B>(f: (a: A) => Observable<B>) => <S, R, E>(first: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, B>
export function chainObservableK<M extends URIS3>(
    F: FromObservable3<M>,
    M: Chain3<M>
): <A, B>(f: (a: A) => Observable<B>) => <R, E>(first: Kind3<M, R, E, A>) => Kind3<M, R, E, B>
export function chainObservableK<M extends URIS3, E>(
    F: FromObservable3C<M, E>,
    M: Chain3C<M, E>
): <A, B>(f: (a: A) => Observable<B>) => <R>(first: Kind3<M, R, E, A>) => Kind3<M, R, E, B>
export function chainObservableK<M extends URIS2>(
    F: FromObservable2<M>,
    M: Chain2<M>
): <A, B>(f: (a: A) => Observable<B>) => <E>(first: Kind2<M, E, A>) => Kind2<M, E, B>
export function chainObservableK<M extends URIS2, E>(
    F: FromObservable2C<M, E>,
    M: Chain2C<M, E>
): <A, B>(f: (a: A) => Observable<B>) => (first: Kind2<M, E, A>) => Kind2<M, E, B>
export function chainObservableK<M extends URIS>(
    F: FromObservable1<M>,
    M: Chain1<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: Kind<M, A>) => Kind<M, B>
export function chainObservableK<M>(
    F: FromObservable<M>,
    M: Chain<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: HKT<M, A>) => HKT<M, B>
export function chainObservableK<M>(
    F: FromObservable<M>,
    M: Chain<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: HKT<M, A>) => HKT<M, B> {
    return f => {
        const g = flow(f, F.fromObservable)
        return first => M.chain(first, g)
    }
}

/**
 * @since 0.6.12
 */
export function chainFirstObservableK<M extends URIS4>(
    F: FromObservable4<M>,
    M: Chain4<M>
): <A, B>(f: (a: A) => Observable<B>) => <S, R, E>(first: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, A>
export function chainFirstObservableK<M extends URIS3>(
    F: FromObservable3<M>,
    M: Chain3<M>
): <A, B>(f: (a: A) => Observable<B>) => <R, E>(first: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function chainFirstObservableK<M extends URIS3, E>(
    F: FromObservable3C<M, E>,
    M: Chain3C<M, E>
): <A, B>(f: (a: A) => Observable<B>) => <R>(first: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function chainFirstObservableK<M extends URIS2>(
    F: FromObservable2<M>,
    M: Chain2<M>
): <A, B>(f: (a: A) => Observable<B>) => <E>(first: Kind2<M, E, A>) => Kind2<M, E, A>
export function chainFirstObservableK<M extends URIS2, E>(
    F: FromObservable2C<M, E>,
    M: Chain2C<M, E>
): <A, B>(f: (a: A) => Observable<B>) => (first: Kind2<M, E, A>) => Kind2<M, E, A>
export function chainFirstObservableK<M extends URIS>(
    F: FromObservable1<M>,
    M: Chain1<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: Kind<M, A>) => Kind<M, A>
export function chainFirstObservableK<M>(
    F: FromObservable<M>,
    M: Chain<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: HKT<M, A>) => HKT<M, A>
export function chainFirstObservableK<M>(
    F: FromObservable<M>,
    M: Chain<M>
): <A, B>(f: (a: A) => Observable<B>) => (first: HKT<M, A>) => HKT<M, A> {
    const chainFirstM = chainFirst(M)
    return f => chainFirstM(flow(f, F.fromObservable))
}
