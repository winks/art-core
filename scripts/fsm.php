<?php
// define states
define('STATE_INIT', 'STATE_INIT');
define('STATE_FIN', 'STATE_FIN');
define('STATE_RED', 'STATE_RED');
define('STATE_ORANGE', 'STATE_ORANGE');
define('STATE_GREEN', 'STATE_GREEN');
define('STATE_YELLOW', 'STATE_YELLOW');

class State {
    // what am I?
    private $state;
    // my possible exit points
    private $exits = array();

    function __construct($state){
        $this->state = $state;
    }
    public function addExit($exit, $event = 'default') {
        $this->exits[$event] = $exit;
    }
    public function isValidExit(State $check) {
        return in_array($check, $this->exits);
    }
    public function isValidTrans($check) {
        return array_key_exists($check, $this->exits);
    }
    // this is where stuff happens, needs to be given in constructor
    public function call() {
        echo substr($this->state, 6,1);
    }
    // give me a transition
    public function trans($event = 'default') {
        if ($this->isValidTrans($event)) {
            return $this->exits[$event];
        } else {
            return false;
        }
    }
    // meh
    public function toString() {
        return $this->state;
    }
}

class FSM {
    // the possible states
    private $states = array(
        STATE_INIT,
        STATE_FIN,
        STATE_RED,
        STATE_ORANGE,
        STATE_GREEN,
        STATE_YELLOW,
    );
    // current state
    private $current;
    function __construct() {
        // objects!
        $this->init   = new State(STATE_INIT);
        $this->red    = new State(STATE_RED);
        $this->orange = new State(STATE_ORANGE);
        $this->green  = new State(STATE_GREEN);
        $this->yellow = new State(STATE_YELLOW);
        $this->fin    = new State(STATE_FIN);
        
        // add transitions, all "default" here
        $this->init->addExit($this->red);
        $this->red->addExit($this->orange);
        $this->orange->addExit($this->green);
        $this->green->addExit($this->yellow);
        $this->yellow->addExit($this->red);
        
        $this->run($this->init, $this->fin);
    }
    
    private function run($start, $end) {
        $this->current = $start;

        while ($this->current->toString() != $end->toString()) {
            $this->tick();
        }
    }
    // go-go-gadgeto-get-following-state
    private function tick() {
        if (in_array($this->current->toString(), $this->states)) {
            $this->current->call();
            $new = $this->current->trans();
            if ($new) {
                $this->current = $new;
            } else {
                throw new Exception("foo");
            }
        } else {
            throw new Exception("bar");
        }
    }
}

$f = new FSM();
$f->run();
