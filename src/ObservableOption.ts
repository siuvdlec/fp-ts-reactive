/**
 * @since 0.6.14
 */
import type { Alt1 } from 'fp-ts/Alt'
import type { Applicative1 } from 'fp-ts/Applicative'
import type { Apply1 } from 'fp-ts/Apply'
import type { Chain1 } from 'fp-ts/Chain'
import type { Either } from 'fp-ts/Either'
import { chainEitherK as chainEitherK_, FromEither1, fromEitherK as fromEitherK_ } from 'fp-ts/FromEither'
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, FromIO1, fromIOK as fromIOK_ } from 'fp-ts/FromIO'
import {
    chainFirstTaskK as chainFirstTaskK_,
    chainTaskK as chainTaskK_,
    FromTask1,
    fromTaskK as fromTaskK_,
} from 'fp-ts/FromTask'
import type { Functor1 } from 'fp-ts/Functor'
import type { IO } from 'fp-ts/IO'
import type { Monad1 } from 'fp-ts/Monad'
import type { MonadIO1 } from 'fp-ts/MonadIO'
import type { MonadTask1 } from 'fp-ts/MonadTask'
import * as O from 'fp-ts/Option'
import * as OT from 'fp-ts/OptionT'
import type * as T from 'fp-ts/Task'
import { flow, identity, Lazy, Predicate, Refinement } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import type { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
    chainFirstObservableK as chainFirstObservableK_,
    chainObservableK as chainObservableK_,
    FromObservable1,
    fromObservableK as fromObservableK_,
} from './FromObservable'
import type { MonadObservable1 } from './MonadObservable'
import * as R from './Observable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.6.14
 */
export interface ObservableOption<A> extends Observable<O.Option<A>> {}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.14
 */
export const none: ObservableOption<never> =
    /*#__PURE__*/
    pipe(O.none, R.of)

/**
 * @category constructors
 * @since 0.6.14
 */
export const some: <A>(a: A) => ObservableOption<A> =
    /*#__PURE__*/
    flow(O.some, R.of)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromObservable: <A = never>(ma: Observable<A>) => ObservableOption<A> =
    /*#__PURE__*/
    R.map(O.some)

/**
 * @category constructors
 * @since 0.6.12
 */
export const fromEither: <A>(fa: Either<unknown, A>) => ObservableOption<A> = /*#__PURE__*/ OT.fromEither(R.Pointed)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromIO: <A = never>(ma: IO<A>) => ObservableOption<A> =
    /*#__PURE__*/
    flow(R.fromIO, fromObservable)

/**
 * @category constructors
 * @since 0.6.14
 */
export const fromTask: MonadTask1<URI>['fromTask'] =
    /*#__PURE__*/
    flow(R.fromTask, fromObservable)

/**
 * @category constructors
 * @since 0.6.14
 */
export const tryCatch: <A>(a: Observable<A>) => ObservableOption<A> =
    /*#__PURE__*/
    flow(
        R.map(O.some),
        catchError(() => none)
    )

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category pattern matching
 * @since 0.6.12
 */
export const match: <B, A>(onNone: () => B, onSome: (a: A) => B) => (ma: ObservableOption<A>) => Observable<B> =
    /*#__PURE__*/ OT.match(R.Functor)

/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 0.6.12
 */
export const matchW: <B, A, C>(onNone: () => B, onSome: (a: A) => C) => (ma: ObservableOption<A>) => Observable<B | C> =
    match as any

/**
 * @category destructors
 * @since 0.6.14
 */
export const fold: <A, B>(
    onNone: () => Observable<B>,
    onSome: (a: A) => Observable<B>
) => (ma: ObservableOption<A>) => Observable<B> =
    /*#__PURE__*/
    flow(O.fold, R.chain)

/**
 * @category destructors
 * @since 0.6.12
 */
export const foldW: <B, C, A>(
    onNone: () => Observable<B>,
    onSome: (a: A) => Observable<C>
) => (ma: ObservableOption<A>) => Observable<B | C> = fold as any

/**
 * @category destructors
 * @since 0.6.14
 */
export const getOrElse =
    <A>(onNone: () => Observable<A>) =>
    (ma: ObservableOption<A>): Observable<A> =>
        pipe(ma, R.chain(O.fold(onNone, R.of)))

/**
 * @category destructors
 * @since 0.6.12
 */
export const getOrElseW: <B>(onNone: () => Observable<B>) => <A>(ma: ObservableOption<A>) => Observable<A | B> =
    getOrElse as any

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const alt: <A>(onNone: () => ObservableOption<A>) => (ma: ObservableOption<A>) => ObservableOption<A> = f =>
    R.chain(O.fold(f, some))

/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 0.6.12
 */
export const altW: <B>(
    second: Lazy<ObservableOption<B>>
) => <A>(first: ObservableOption<A>) => ObservableOption<A | B> = alt as any

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.14
 */
export const map: <A, B>(f: (a: A) => B) => (fa: ObservableOption<A>) => ObservableOption<B> = f => R.map(O.map(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.14
 */
export const ap = <A>(fa: ObservableOption<A>): (<B>(fab: ObservableOption<(a: A) => B>) => ObservableOption<B>) =>
    flow(
        R.map(gab => (ga: O.Option<A>) => O.ap(ga)(gab)),
        R.ap(fa)
    )

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const apFirst: <B>(fb: ObservableOption<B>) => <A>(fa: ObservableOption<A>) => ObservableOption<A> = fb =>
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
 * @since 0.6.14
 */
export const apSecond = <B>(fb: ObservableOption<B>): (<A>(fa: ObservableOption<A>) => ObservableOption<B>) =>
    flow(
        map(() => (b: B) => b),
        ap(fb)
    )

/**
 * @category Monad
 * @since 0.6.14
 */
export const chain =
    <A, B>(f: (a: A) => ObservableOption<B>) =>
    (ma: ObservableOption<A>): ObservableOption<B> =>
        pipe(ma, R.chain(O.fold(() => none, f)))

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const flatten: <A>(mma: ObservableOption<ObservableOption<A>>) => ObservableOption<A> =
    /*#__PURE__*/
    chain(identity)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.14
 */
export const chainFirst: <A, B>(
    f: (a: A) => ObservableOption<B>
) => (ma: ObservableOption<A>) => ObservableOption<A> = f =>
    chain(a =>
        pipe(
            f(a),
            map(() => a)
        )
    )

/**
 * @since 0.6.14
 */
export const of: Applicative1<URI>['of'] = some

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const filterOrElse: {
    <A, B extends A>(refinement: Refinement<A, B>): (ma: ObservableOption<A>) => ObservableOption<B>
    <A>(predicate: Predicate<A>): (ma: ObservableOption<A>) => ObservableOption<A>
} = <A>(predicate: Predicate<A>): ((ma: ObservableOption<A>) => ObservableOption<A>) =>
    chain(a => (predicate(a) ? of(a) : none))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const fromOption = <A>(ma: O.Option<A>): ObservableOption<A> => (ma._tag === 'None' ? none : of(ma.value))

/**
 * Derivable from `MonadThrow`.
 *
 * @since 0.6.14
 */
export const fromPredicate: {
    <A, B extends A>(refinement: Refinement<A, B>): (a: A) => ObservableOption<B>
    <A>(predicate: Predicate<A>): (a: A) => ObservableOption<A>
} =
    <A>(predicate: Predicate<A>) =>
    (a: A): ObservableOption<A> =>
        predicate(a) ? of(a) : none

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/* istanbul ignore next */
const map_: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
/* istanbul ignore next */
const ap_: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
const chain_: Monad1<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const alt_: Alt1<URI>['alt'] = (fx, fy) => pipe(fx, alt(fy))

/**
 * @category instances
 * @since 0.6.14
 */
export const URI = 'ObservableOption'

/**
 * @category instances
 * @since 0.6.14
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        readonly [URI]: ObservableOption<A>
    }
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Functor: Functor1<URI> = {
    URI,
    map: map_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Apply: Apply1<URI> = {
    URI,
    map: map_,
    ap: ap_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Applicative: Applicative1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const Chain: Chain1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Monad: Monad1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const Alt: Alt1<URI> = {
    URI,
    map: map_,
    alt: alt_,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const MonadIO: MonadIO1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const MonadTask: MonadTask1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
    fromTask,
}

/**
 * @category instances
 * @since 0.6.14
 */
export const MonadObservable: MonadObservable1<URI> = {
    URI,
    map: map_,
    ap: ap_,
    of,
    chain: chain_,
    fromIO,
    fromTask,
    fromObservable,
}

/**
 * @category instances
 * @since 0.6.12
 */
export const FromIO: FromIO1<URI> = {
    URI,
    fromIO,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => IO<B>) => (...a: A) => ObservableOption<B> =
    /*#__PURE__*/ fromIOK_(FromIO)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainIOK: <A, B>(f: (a: A) => IO<B>) => (first: ObservableOption<A>) => ObservableOption<B> =
    /*#__PURE__*/ chainIOK_(FromIO, Chain)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstIOK: <A, B>(f: (a: A) => IO<B>) => (first: ObservableOption<A>) => ObservableOption<A> =
    /*#__PURE__*/ chainFirstIOK_(FromIO, Chain)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromEither: FromEither1<URI> = {
    URI,
    fromEither,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => Either<E, B>
) => (...a: A) => ObservableOption<B> = /*#__PURE__*/ fromEitherK_(FromEither)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainEitherK: <E, A, B>(f: (a: A) => Either<E, B>) => (ma: ObservableOption<A>) => ObservableOption<B> =
    /*#__PURE__*/ chainEitherK_(FromEither, Chain)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstEitherK: <E, A, B>(
    f: (a: A) => Either<E, B>
) => (ma: ObservableOption<A>) => ObservableOption<A> = flow(fromEitherK, chainFirst)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromTask: FromTask1<URI> = {
    URI,
    fromIO,
    fromTask,
}

/**
 * @category lifting
 * @since 0.6.12
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => T.Task<B>
) => (...a: A) => ObservableOption<B> = /*#__PURE__*/ fromTaskK_(FromTask)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: ObservableOption<A>) => ObservableOption<B> =
    /*#__PURE__*/ chainTaskK_(FromTask, Chain)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: ObservableOption<A>) => ObservableOption<A> =
    /*#__PURE__*/ chainFirstTaskK_(FromTask, Chain)

/**
 * @category instances
 * @since 0.6.12
 */
export const FromObservable: FromObservable1<URI> = {
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
) => (...a: A) => ObservableOption<B> = /*#__PURE__*/ fromObservableK_(FromObservable)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainObservableK: <A, B>(
    f: (a: A) => Observable<B>
) => (first: ObservableOption<A>) => ObservableOption<B> = /*#__PURE__*/ chainObservableK_(FromObservable, Chain)

/**
 * @category sequencing
 * @since 0.6.12
 */
export const chainFirstObservableK: <A, B>(
    f: (a: A) => Observable<B>
) => (first: ObservableOption<A>) => ObservableOption<A> = /*#__PURE__*/ chainFirstObservableK_(FromObservable, Chain)

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.14
 */
export const Do: ObservableOption<Record<string, never>> =
    /*#__PURE__*/
    of({})

/**
 * @since 0.6.14
 */
export const bindTo = <K extends string, A>(
    name: K
): ((fa: ObservableOption<A>) => ObservableOption<{ [P in K]: A }>) => map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.14
 */
export const bind = <K extends string, A, B>(
    name: Exclude<K, keyof A>,
    f: (a: A) => ObservableOption<B>
): ((fa: ObservableOption<A>) => ObservableOption<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>) =>
    chain(a =>
        pipe(
            f(a),
            map(b => ({ ...a, [name]: b } as any))
        )
    )
