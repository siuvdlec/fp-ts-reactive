/**
 * @since 0.6.10
 */
import type { Alt3 } from 'fp-ts/Alt'
import type { Applicative3 } from 'fp-ts/Applicative'
import type { Apply3 } from 'fp-ts/Apply'
import type { Bifunctor3 } from 'fp-ts/Bifunctor'
import type { Chain3 } from 'fp-ts/Chain'
import type { Either } from 'fp-ts/Either'
import * as ET from 'fp-ts/EitherT'
import {
    chainEitherK as chainEitherK_,
    chainOptionK as chainOptionK_,
    FromEither3,
    fromEitherK as fromEitherK_,
    fromOptionK as fromOptionK_,
} from 'fp-ts/FromEither'
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, FromIO3, fromIOK as fromIOK_ } from 'fp-ts/FromIO'
import {
    chainFirstReaderK as chainFirstReaderK_,
    chainReaderK as chainReaderK_,
    FromReader3,
    fromReaderK as fromReaderK_,
} from 'fp-ts/FromReader'
import {
    chainFirstTaskK as chainFirstTaskK_,
    chainTaskK as chainTaskK_,
    FromTask3,
    fromTaskK as fromTaskK_,
} from 'fp-ts/FromTask'
import type { Functor3 } from 'fp-ts/Functor'
import type { IO } from 'fp-ts/IO'
import type { Monad3 } from 'fp-ts/Monad'
import type { MonadIO3 } from 'fp-ts/MonadIO'
import type { MonadTask3 } from 'fp-ts/MonadTask'
import type { MonadThrow3 } from 'fp-ts/MonadThrow'
import type { Option } from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import type * as RE from 'fp-ts/ReaderEither'
import type { Task } from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { flow, identity, Lazy, Predicate, Refinement } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import type { Observable } from 'rxjs'
import {
    chainFirstObservableK as chainFirstObservableK_,
    chainObservableK as chainObservableK_,
    FromObservable3,
    fromObservableK as fromObservableK_,
} from './FromObservable'
import type { MonadObservable3 } from './MonadObservable'
import * as OE from './ObservableEither'
import * as RO from './ReaderObservable'

import ReaderObservable = RO.ReaderObservable

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.10
 */
export interface ReaderObservableEither<R, E, A> {
    (r: R): OE.ObservableEither<E, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservableEither: <R, E, A>(ma: OE.ObservableEither<E, A>) => ReaderObservableEither<R, E, A> = R.of

/**
 * @category constructors
 * @since 0.6.12
 */
export const right: <R, E = never, A = never>(a: A) => ReaderObservableEither<R, E, A> =
    /*#__PURE__*/
    flow(OE.right, fromObservableEither)

/**
 * @category constructors
 * @since 0.6.12
 */
export const left: <R, E = never, A = never>(e: E) => ReaderObservableEither<R, E, A> =
    /*#__PURE__*/
    flow(OE.left, fromObservableEither)

/**
 * @category constructors
 * @since 0.6.10
 */
export const ask: <R, E>() => ReaderObservableEither<R, E, R> = () => OE.right

/**
 * @category constructors
 * @since 0.6.10
 */
export const asks: <R, E, A>(f: (r: R) => A) => ReaderObservableEither<R, E, A> = f => flow(OE.right, OE.map(f))

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromReader: <R, E, A>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A> = ma => flow(ma, OE.right)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromIO: MonadIO3<URI>['fromIO'] = ma => () => OE.rightIO(ma)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromTask: MonadTask3<URI>['fromTask'] = ma => () => OE.fromTask(ma)

/**
 * @category conversions
 * @since 0.6.12
 */
export const fromTaskEither: <E, A, R = unknown>(fa: TE.TaskEither<E, A>) => ReaderObservableEither<R, E, A> =
    RO.fromTask

/**
 * @category conversions
 * @since 0.6.12
 */
export const fromReaderEither: <R, E, A>(fa: RE.ReaderEither<R, E, A>) => ReaderObservableEither<R, E, A> = ma =>
    flow(ma, OE.fromEither)

/**
 * @category constructors
 * @since 0.6.10
 */
export const fromObservable: MonadObservable3<URI>['fromObservable'] = ma => () => OE.rightObservable(ma)

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightTask: <R, E = never, A = never>(ma: Task<A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ flow(
    TE.rightTask,
    fromTaskEither
)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftTask: <R, E = never, A = never>(me: Task<E>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ flow(
    TE.leftTask,
    fromTaskEither
)

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightReader: <R, E = never, A = never>(ma: R.Reader<R, A>) => ReaderObservableEither<R, E, A> = ma =>
    flow(ma, OE.right)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftReader: <R, E = never, A = never>(me: R.Reader<R, E>) => ReaderObservableEither<R, E, A> = me =>
    flow(me, OE.left)

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightReaderObservable: <R, E = never, A = never>(
    ma: RO.ReaderObservable<R, A>
) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ ET.rightF(RO.Functor)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftReaderObservable: <R, E = never, A = never>(
    me: RO.ReaderObservable<R, E>
) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ ET.leftF(RO.Functor)

/**
 * @category constructors
 * @since 0.6.12
 */
export const rightIO: <R, E = never, A = never>(ma: IO<A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ flow(
    TE.rightIO,
    fromTaskEither
)

/**
 * @category constructors
 * @since 0.6.12
 */
export const leftIO: <R, E = never, A = never>(me: IO<E>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ flow(
    TE.leftIO,
    fromTaskEither
)

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromObservableEitherK = <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => OE.ObservableEither<E, B>
): (<R = unknown>(...a: A) => ReaderObservableEither<R, E, B>) => flow(f, fromObservableEither)

/**
 * Less strict version of [`chainObservableEitherK`](#chainobservableeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainObservableEitherKW: <E2, A, B>(
    f: (a: A) => OE.ObservableEither<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, B> = f =>
    chainW(fromObservableEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainObservableEitherK: <E, A, B>(
    f: (a: A) => OE.ObservableEither<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = chainObservableEitherKW

/**
 * Less strict version of [`chainFirstObservableEitherK`](#chainfirstobservableeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstObservableEitherKW: <E2, A, B>(
    f: (a: A) => OE.ObservableEither<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, A> = f =>
    chainFirstW(fromObservableEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstObservableEitherK: <E, A, B>(
    f: (a: A) => OE.ObservableEither<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = chainFirstObservableEitherKW

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromTaskEitherK = <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => TE.TaskEither<E, B>
): (<R = unknown>(...a: A) => ReaderObservableEither<R, E, B>) => flow(f, fromTaskEither)

/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainTaskEitherKW: <E2, A, B>(
    f: (a: A) => TE.TaskEither<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, B> = f =>
    chainW(fromTaskEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainTaskEitherK: <E, A, B>(
    f: (a: A) => TE.TaskEither<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = chainTaskEitherKW

/**
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstTaskEitherKW: <E2, A, B>(
    f: (a: A) => TE.TaskEither<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, A> = f =>
    chainFirstW(fromTaskEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstTaskEitherK: <E, A, B>(
    f: (a: A) => TE.TaskEither<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = chainFirstTaskEitherKW

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromReaderEitherK = <R, E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => RE.ReaderEither<R, E, B>
): ((...a: A) => ReaderObservableEither<R, E, B>) => flow(f, fromReaderEither)

/**
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainReaderEitherKW: <R2, E2, A, B>(
    f: (a: A) => RE.ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderObservableEither<R1, E1, A>) => ReaderObservableEither<R1 & R2, E1 | E2, B> = f =>
    chainW(fromReaderEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainReaderEitherK: <R, E, A, B>(
    f: (a: A) => RE.ReaderEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = chainReaderEitherKW

/**
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstReaderEitherKW: <R2, E2, A, B>(
    f: (a: A) => RE.ReaderEither<R2, E2, B>
) => <R1, E1>(ma: ReaderObservableEither<R1, E1, A>) => ReaderObservableEither<R1 & R2, E1 | E2, A> = f =>
    chainFirstW(fromReaderEitherK(f))

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstReaderEitherK: <R, E, A, B>(
    f: (a: A) => RE.ReaderEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = chainFirstReaderEitherKW

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.6.10
 */
export const local: <R2, R1>(
    f: (d: R2) => R1
) => <E, A>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservableEither<R2, E, A> = R.local

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category pattern matching
 * @since 0.6.12
 */
export const match: <E, B, A>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservable<R, B> = /*#__PURE__*/ ET.match(RO.Functor)

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 0.6.12
 */
export const matchW: <E, B, A, C>(
    onLeft: (e: E) => B,
    onRight: (a: A) => C
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservable<R, B | C> = match as any

/**
 * @category pattern matching
 * @since 0.6.12
 */
export const fold: <R, E, A, B>(
    onLeft: (e: E) => ReaderObservable<R, B>,
    onRight: (a: A) => ReaderObservable<R, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservable<R, B> = /*#__PURE__*/ ET.matchE(RO.Chain)

/**
 * @category pattern matching
 * @since 0.6.12
 */
export const foldW: <E, R2, B, A, R3, C>(
    onLeft: (e: E) => ReaderObservable<R2, B>,
    onRight: (a: A) => ReaderObservable<R3, C>
) => <R1>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservable<R1 & R2 & R3, B | C> = fold as any

/**
 * @category error handling
 * @since 0.6.12
 */
export const getOrElse: <R, E, A>(
    onLeft: (e: E) => ReaderObservable<R, A>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservable<R, A> = /*#__PURE__*/ ET.getOrElse(RO.Monad)

/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 0.6.12
 */
export const getOrElseW: <R2, E, B>(
    onLeft: (e: E) => ReaderObservable<R2, B>
) => <R1, A>(ma: ReaderObservableEither<R1, E, A>) => ReaderObservable<R1 & R2, A | B> = getOrElse as any

/**
 * @category error handling
 * @since 0.6.12
 */
export const orElse: <R, E1, A, E2>(
    onLeft: (e: E1) => ReaderObservableEither<R, E2, A>
) => (ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E2, A> = /*#__PURE__*/ ET.orElse(RO.Monad)

/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the return types will be merged.
 *
 * @category error handling
 * @since 0.6.12
 */
export const orElseW: <E1, R1, E2, B>(
    onLeft: (e: E1) => ReaderObservableEither<R1, E2, B>
) => <R2, A>(ma: ReaderObservableEither<R2, E1, A>) => ReaderObservableEither<R1 & R2, E2, A | B> = orElse as any

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category MonadThrow
 * @since 0.6.10
 */
export const throwError: MonadThrow3<URI>['throwError'] = e => () => OE.left(e)

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.10
 */
export const map: <A, B>(
    f: (a: A) => B
) => <R, E>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = f => fa => flow(fa, OE.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.10
 */
export const ap: <R, E, A>(
    fa: ReaderObservableEither<R, E, A>
) => <B>(fab: ReaderObservableEither<R, E, (a: A) => B>) => ReaderObservableEither<R, E, B> = fa => fab => r =>
    pipe(fab(r), OE.ap(fa(r)))

/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 0.6.12
 */
export const apW: <R2, E2, A>(
    fa: ReaderObservableEither<R2, E2, A>
) => <R1, E1, B>(fab: ReaderObservableEither<R1, E1, (a: A) => B>) => ReaderObservableEither<R1 & R2, E1 | E2, B> =
    ap as any

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const apFirst: <R, E, B>(
    fb: ReaderObservableEither<R, E, B>
) => <A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = fb =>
    flow(
        map(a => () => a),
        ap(fb)
    )

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const apSecond = <R, E, B>(
    fb: ReaderObservableEither<R, E, B>
): (<A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B>) =>
    flow(
        map(() => (b: B) => b),
        ap(fb)
    )

/**
 * @category Applicative
 * @since 0.6.10
 */
export const of: Applicative3<URI>['of'] = right

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const bimap: <E, G, A, B>(
    f: (e: E) => G,
    g: (a: A) => B
) => <R>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, B> = (f, g) => fea => r =>
    OE.bimap(f, g)(fea(r))

/**
 * @category Bifunctor
 * @since 0.6.10
 */
export const mapLeft: <E, G>(
    f: (e: E) => G
) => <R, A>(fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, G, A> = f => fea => r =>
    OE.mapLeft(f)(fea(r))

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 0.6.12
 */
export const chainW =
    <A, R2, E2, B>(f: (a: A) => ReaderObservableEither<R2, E2, B>) =>
    <R1, E1>(ma: ReaderObservableEither<R1, E1, A>): ReaderObservableEither<R1 & R2, E1 | E2, B> =>
    r =>
        pipe(
            ma(r),
            OE.chainW(a => f(a)(r))
        )

/**
 * @category Monad
 * @since 0.6.10
 */
export const chain: <R, E, A, B>(
    f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = chainW

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const flattenW: <R1, E1, R2, E2, A>(
    mma: ReaderObservableEither<R1, E1, ReaderObservableEither<R2, E2, A>>
) => ReaderObservableEither<R1 & R2, E1 | E2, A> = /*#__PURE__*/ chainW(identity)

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const flatten: <R, E, A>(
    mma: ReaderObservableEither<R, E, ReaderObservableEither<R, E, A>>
) => ReaderObservableEither<R, E, A> = flattenW

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 0.6.12
 */
export const alt: <R, E, A>(
    that: () => ReaderObservableEither<R, E, A>
) => (fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ ET.alt(RO.Monad)

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 0.6.12
 */
export const altW: <R2, E2, B>(
    that: () => ReaderObservableEither<R2, E2, B>
) => <R1, E1, A>(fa: ReaderObservableEither<R1, E1, A>) => ReaderObservableEither<R1 & R2, E2, A | B> = alt as any

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.10
 */
export const chainFirst: <R, E, A, B>(
    f: (a: A) => ReaderObservableEither<R, E, B>
) => (ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = f =>
    chain(a =>
        pipe(
            f(a),
            map(() => a)
        )
    )

/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * @category combinators
 * @since 0.6.12
 */
export const chainFirstW: <R2, E2, A, B>(
    f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(ma: ReaderObservableEither<R1, E1, A>) => ReaderObservableEither<R1 & R2, E1 | E2, A> = chainFirst as any

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const filterOrElse: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
        ma: ReaderObservableEither<R, E, A>
    ) => ReaderObservableEither<R, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(
        ma: ReaderObservableEither<R, E, A>
    ) => ReaderObservableEither<R, E, A>
} = <E, A>(
    predicate: Predicate<A>,
    onFalse: (a: A) => E
): (<R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A>) =>
    chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.12
 */
export const filterOrElseW: {
    <E2, E1, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <R>(
        ma: ReaderObservableEither<R, E1, A>
    ) => ReaderObservableEither<R, E1 | E2, B>
    <E2, E1, A>(predicate: Predicate<A>, onFalse: (a: A) => E2): <R>(
        ma: ReaderObservableEither<R, E1, A>
    ) => ReaderObservableEither<R, E1 | E2, A>
} = filterOrElse as any

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromEither: <R, E, A>(ma: Either<E, A>) => ReaderObservableEither<R, E, A> = ma =>
    ma._tag === 'Left' ? throwError(ma.left) : of(ma.right)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromOption =
    <E>(onNone: () => E) =>
    <R, A>(ma: Option<A>): ReaderObservableEither<R, E, A> =>
        ma._tag === 'None' ? throwError(onNone()) : of(ma.value)

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.10
 */
export const fromPredicate: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(
        a: A
    ) => ReaderObservableEither<R, E, B>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderObservableEither<R, E, A>
} =
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) =>
    <R>(a: A): ReaderObservableEither<R, E, A> =>
        predicate(a) ? of(a) : throwError(onFalse(a))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const map_: Functor3<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const ap_: Apply3<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad3<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const alt_: Alt3<URI>['alt'] = (fa, that) => pipe(fa, alt(that))
/* istanbul ignore next */
const bimap_: Bifunctor3<URI>['bimap'] = (fea, f, g) => pipe(fea, bimap(f, g))
/* istanbul ignore next */
const mapLeft_: Bifunctor3<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))

/**
 * @category instances
 * @since 0.6.10
 */
export const URI = 'ReaderObservableEither'

/**
 * @category instances
 * @since 0.6.10
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
    export interface URItoKind3<R, E, A> {
        readonly [URI]: ReaderObservableEither<R, E, A>
    }
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Functor: Functor3<URI> = {
    URI,
    map: map_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Apply: Apply3<URI> = {
    URI,
    map: map_,
    ap: ap_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Applicative: Applicative3<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Chain: Chain3<URI> = {
    URI,
    map: map_,
    ap: ap_,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Monad: Monad3<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Bifunctor: Bifunctor3<URI> = {
    URI,
    bimap: bimap_,
    mapLeft: mapLeft_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Alt: Alt3<URI> = {
    URI,
    map: map_,
    alt: alt_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadIO: MonadIO3<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadTask: MonadTask3<URI> = {
    URI,
    map: map_,
    of,
    ap: ap_,
    chain: chain_,
    fromIO,
    fromTask,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadObservable: MonadObservable3<URI> = {
    URI,
    map: map_,
    of,
    ap: ap_,
    chain: chain_,
    fromIO,
    fromObservable,
    fromTask,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const MonadThrow: MonadThrow3<URI> = {
    URI,
    map: map_,
    of,
    ap: ap_,
    chain: chain_,
    throwError,
}

/**
 * @category instances
 * @since 0.6.10
 * @deprecated
 */
export const readerObservableEither: MonadObservable3<URI> & MonadThrow3<URI> & Bifunctor3<URI> = {
    URI,
    ap: ap_,
    map: map_,
    of,
    chain: chain_,
    fromIO,
    fromObservable,
    fromTask,
    throwError,
    bimap: bimap_,
    mapLeft: mapLeft_,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const FromEither: FromEither3<URI> = {
    URI,
    fromEither,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromOptionK: <E>(
    onNone: Lazy<E>
) => <A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Option<B>
) => <R = unknown>(...a: A) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ fromOptionK_(FromEither)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainOptionK: <E>(
    onNone: Lazy<E>
) => <A, B>(f: (a: A) => Option<B>) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> =
    /*#__PURE__*/ chainOptionK_(FromEither, Chain)

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Either<E, B>
) => <R = unknown>(...a: A) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ fromEitherK_(FromEither)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainEitherK: <E, A, B>(
    f: (a: A) => Either<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ chainEitherK_(
    FromEither,
    Chain
)

/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainEitherKW: <E2, A, B>(
    f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, B> = chainEitherK as any

/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstEitherKW: <A, E2, B>(
    f: (a: A) => Either<E2, B>
) => <R, E1>(ma: ReaderObservableEither<R, E1, A>) => ReaderObservableEither<R, E1 | E2, A> = flow(
    fromEitherK,
    chainFirstW
)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstEitherK: <A, E, B>(
    f: (a: A) => Either<E, B>
) => <R>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = chainFirstEitherKW

/**
 * @category instances
 * @since 0.6.12
 */
export const FromIO: FromIO3<URI> = {
    URI,
    fromIO,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => IO<B>
) => <R = unknown, E = never>(...a: A) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ fromIOK_(FromIO)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainIOK: <A, B>(
    f: (a: A) => IO<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ chainIOK_(
    FromIO,
    Chain
)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstIOK: <A, B>(
    f: (a: A) => IO<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ chainFirstIOK_(
    FromIO,
    Chain
)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromTask: FromTask3<URI> = {
    URI,
    fromIO,
    fromTask,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Task<B>
) => <R = unknown, E = never>(...a: A) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ fromTaskK_(FromTask)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainTaskK: <A, B>(
    f: (a: A) => Task<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ chainTaskK_(
    FromTask,
    Chain
)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstTaskK: <A, B>(
    f: (a: A) => Task<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ chainFirstTaskK_(
    FromTask,
    Chain
)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromObservable: FromObservable3<URI> = {
    URI,
    fromIO,
    fromTask,
    fromObservable,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromObservableK: <A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Observable<B>
) => <R = unknown, E = never>(...a: A) => ReaderObservableEither<R, E, B> =
    /*#__PURE__*/ fromObservableK_(FromObservable)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainObservableK: <A, B>(
    f: (a: A) => Observable<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> =
    /*#__PURE__*/ chainObservableK_(FromObservable, Chain)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstObservableK: <A, B>(
    f: (a: A) => Observable<B>
) => <R, E>(first: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> =
    /*#__PURE__*/ chainFirstObservableK_(FromObservable, Chain)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromReader: FromReader3<URI> = {
    URI,
    fromReader,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromReaderK: <A extends ReadonlyArray<unknown>, R, B>(
    f: (...a: A) => R.Reader<R, B>
) => <E = never>(...a: A) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ fromReaderK_(FromReader)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainReaderK: <A, R, B>(
    f: (a: A) => R.Reader<R, B>
) => <E>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, B> = /*#__PURE__*/ chainReaderK_(
    FromReader,
    Chain
)

/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainReaderKW: <A, R1, B>(
    f: (a: A) => R.Reader<R1, B>
) => <R2, E>(ma: ReaderObservableEither<R2, E, A>) => ReaderObservableEither<R1 & R2, E, B> = chainReaderK as any

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstReaderK: <A, R, B>(
    f: (a: A) => R.Reader<R, B>
) => <E>(ma: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, A> = /*#__PURE__*/ chainFirstReaderK_(
    FromReader,
    Chain
)

/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstReaderKW: <A, R1, B>(
    f: (a: A) => R.Reader<R1, B>
) => <R2, E>(ma: ReaderObservableEither<R2, E, A>) => ReaderObservableEither<R1 & R2, E, A> = chainFirstReaderK as any

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
export const Do: ReaderObservableEither<unknown, never, Record<string, never>> =
    /*#__PURE__*/
    of({})

/**
 * @since 0.6.11
 */
export const bindTo = <K extends string, R, E, A>(
    name: K
): ((fa: ReaderObservableEither<R, E, A>) => ReaderObservableEither<R, E, { [P in K]: A }>) =>
    map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
export const bind = <K extends string, R, E, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ReaderObservableEither<R, E, B>
): ((
    fa: ReaderObservableEither<R, E, A>
) => ReaderObservableEither<R, E, { [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
    chain(a =>
        pipe(
            f(a),
            map(b => ({ ...a, [name]: b } as any))
        )
    )

/**
 * @since 0.6.12
 */
export const bindW: <K extends string, R2, E2, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ReaderObservableEither<R2, E2, B>
) => <R1, E1>(
    fa: ReaderObservableEither<R1, E1, A>
) => ReaderObservableEither<R1 & R2, E1 | E2, { [P in keyof A | K]: P extends keyof A ? A[P] : B }> = bind as any
