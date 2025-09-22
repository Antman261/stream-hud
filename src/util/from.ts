import { OfKind } from './OfUnion';
type Mapper = (item: any) => any;
type Ops<T> = Op<'add', T> | Op<'remove', T> | Op<'map', Mapper>;
type Op<K extends OpKind, A> = { kind: K; args: A[] };
type OpKind = 'add' | 'remove' | 'map';
type OpSet<T> = { [key in OpKind]: OfKind<Ops<T>, key>['args'] };
type Plan<T> = OpSet<T>[];
type OpFn<A> = (a: A[], i: number) => unknown;
type Operator<T> = { add: OpFn<T>; remove: OpFn<T>; map: OpFn<Mapper> };

export const from = <T>(arr: T[], copy = false) => {
  const target = copy ? [...arr] : arr;
  const ops: Ops<T>[] = [];
  const makeOp =
    <A>(kind: OpKind) =>
    (...args: A[]) => {
      const op = ops.at(-1); // @ts-expect-error
      op?.kind === kind ? op.args.push(...args) : ops.push({ kind, args });
      return wrapper;
    };
  const wrapper = {
    remove: makeOp<T>('remove'),
    add: makeOp<T>('add'),
    map: makeOp<Mapper>('map'),
    result() {
      const isNoop = target.length === 0 || ops.length === 0;
      if (isNoop) return target;
      const operator = getOperator(target);
      for (const step of generatePlan(ops)) {
        operator.add(step.add, 0);
        if (step.remove.length || step.map.length) {
          const remover = (i: number) => operator.remove(step.remove, i);
          const mapper = (i: number) => operator.map(step.map, i);
          const operate = (i: number) => remover(i) || mapper(i);
          for (let i = target.length - 1; i > -1; i--) operate(i);
        }
      }
      return target;
    },
  };
  return wrapper;
};
export const fromCopyOf = <T>(arr: T[]) => from(arr, true);

function getOperator<T>(ar: T[]): Operator<T> {
  const mxs = new Map<Mapper[], Mapper>();
  return {
    add: (args) => ar.push(...(args ?? [])),
    remove: (args, i) => args?.includes(ar[i]) && ar.splice(i, 1).length,
    map(args, idx) {
      if (args.length === 0) return;
      const mx =
        mxs.get(args) ??
        args.reduce(
          (p, c) => (it) => c(p(it)),
          (it) => it
        );
      mxs.set(args, mx);
      ar[idx] = mx(ar[idx]);
    },
  };
}

function generatePlan<T>(ops: Ops<T>[]): Plan<T> {
  const plan: Plan<T> = [];
  for (const op of ops) {
    const needsNewStep = plan.at(-1)?.map.length !== 0;
    if (needsNewStep) plan.push({ add: [], remove: [], map: [] });
    const opSet = plan.at(-1)!;
    if (op.kind === 'add') opSet.add.push(...op.args);
    if (op.kind === 'remove') opSet.remove.push(...op.args);
    if (op.kind === 'map') opSet.map.push(...op.args);
  }
  return plan;
}
