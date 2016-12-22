import * as assert from "assert"
import {it} from "mocha"

type GoalsEditState = Displaying | Editing;
type Displaying = { kind: 'displaying' };
type Editing = { kind: 'editing', flags: boolean[] };

type Point = {x: number, y: number};
type Region = (Point) => boolean;

const and = (x, y) => x && y

function foo(state : GoalsEditState): boolean{
    switch (state.kind){
        case 'displaying':
            return true
        case 'editing':
            return state.flags.reduce(and, true)
    }
}

function foo2(x){
    if (x.flags){
        return x.flags[0]
    }
}

function currentState(): GoalsEditState{
    return {kind: 'editing', flags: [false, true]}
}

it('should do', function(){
    assert.notEqual(foo(currentState()), null)
})


foo({kind: 'displaying'})

type Goal = {title: string}

type GoalEdit = Add | Delete | Update | SetActivity;
type Add = {kind: 'add', goal: Goal}
type Delete = {kind: 'delete', goal: Goal}
type Update = {kind: 'update', goal: Goal}
type SetActivity = {kind: 'setactivity', activity: boolean[]}

type ProgressEdit = {kind: 'bump', goal: Goal}

type Edit = GoalEdit | ProgressEdit


interface Observable<T>{
    observe(f: (t: T) => void): void;
}



class Changing<T> implements Observable<T>{
    observers : ((t: T) => void)[]

    observe(observer: (t: T) => void): void{
        this.observers.push(observer)
    }

    announce(change: T){
        this.observers.forEach(observer =>
            observer(change)
        )
    }
}

class Accumulating<Value, Accumulator> implements Observable<Accumulator>{
    observers : ((t: Accumulator) => void)[]

    observe(observer: (t: Accumulator) => void): void{
        this.observers.push(observer)
    }
}

