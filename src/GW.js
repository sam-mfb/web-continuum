/*
  File GW.js: definitions converted to javascript object from the original C header file:
  
    File GW.h:  macros, definitions for Gravity Well in Lightspeed C
	
    Copyright (c) 1986-88 Randall H. Wilson
  
  Updated by S. Davidoff 2020
*/

const GW = {
  dimensions: {
    SCRWTH: 512,
    SCRHT: 342,
    SBARHT: 24,
    get VIEWHT() {
      return this.SCRHT - this.SBARHT
    },

    LEFTMARG: 180,
    get RIGHTMARG() {
      return this.SCRWTH - this.LEFTMARG
    },
    TOPMARG: 140,
    get BOTMARG() {
      return this.VIEWHT - this.TOPMARG
    },
    SOFTBORDER: 200,
    SHOOTMARG: 300 /* distance from screen bunkers fire*/,
    MAPBORDER: 5 /* space around map on screen		*/,
    get MAPWTH() {
      return this.SCRWTH - 2 * this.MAPBORDER
    } /* size of map		*/,
    get MAPHT() {
      return this.SCRHT - (40 + 2 * this.MAPBORDER)
    },

    EDWINHT: 284 /* size of editing rectangle in Editor */,
    EDWINWTH: 492,
    PRECTHT: 284 /* size of planet enclosing rectangle */,
    PRECTWTH: 460
  },
  attributes: {
    SCROLLSPEED: 32 /* scrolling speeds */,
    PAGESPEED: 250,
    FANGLESIZE: 50 /* magnitude of firing angle wedges */
  },
  planetFile: {
    FILEHEAD: 160 /* planet file sizes */,
    PLANHEAD: 30,
    PLANSIZE: 1540
  },
  game: {
    MAXSTARTLEVEL: 100 /* highest starting level		*/,
    NUMLINES: 125 /* maximum number of terrain lines	*/,
    NUMBULLETS: 6 /* number of ship's shots at once	*/,
    NUMBUNKERS: 25 /* largest number of bunkers		*/,
    NUMFUELS: 15 /* largest number of fuel cells	*/,
    NUMSHOTS: 20 /* number of bunker shots at once	*/,
    NUMSHARDS: 15 /* maximum # of concurrent shards	*/,
    NUMSPARKS: 100 /* number of sparks in explosions	*/,
    NUMSTRAFES: 5 /* max strafes at once			*/,
    NUMCRATERS: 50 /* number of craters at a time	*/,
    NUMPRECRATS: 25 /* # craters before bunkers explode	*/,
    NUMGENS: 25 /* # of generator bunkers allowed	*/,
    CARTOONSIZE: 100 /* number of parameters in cartoon	*/,
    NUMHISCORES: 10 /* number of high score entries	*/,

    SHOTLEN: 35 /* cycles bullets keep going		*/,
    get BUNKSHLEN() {
      return this.SHOTLEN - 5
    } /* cycles bunk shots keep going	*/,

    SHIPSTART: 2 /* number of ships to start with	*/,
    FUELSTART: 10000 /* starting amount of fuel		*/,
    MAXFUEL: 25000 /* maximum fuel value			*/,
    FUELBURN: 16 /* amount of fuel used each thrust	*/,
    FUELSHIELD: 83 /* amount of fuel used to shield	*/,
    FUELGAIN: 2000 /* amount of fuel gained from cell	*/,
    CRITFUEL: 2000 /* amount of fuel considered critical */,
    FUELBEEPS: 3 /* number of beeps in fuel pickup	*/,

    SCOREBUNK: 200 /* not used: see kill_bunk function */,
    SCOREFUEL: 15 /* score for fuel pickup		*/,

    DEAD_TIME: 80 /* cycles to continue after death	*/
  },
  ship: {
    SHIPHT: 32 /* height of ship bit map		*/,
    SCENTER: 15 /* distance of ship center from side*/,
    FCENTER: 3 /* center of flame from upleft	*/,
    SHRADIUS: 12 /* effective radius of shield		*/
  },
  bunker: {
    BUNKHT: 48,
    BUNKKINDS: 5,
    BUNKROTKINDS: 2 /* number of kinds that sit on walls*/,
    WALLBUNK: 0 /* normal sit-on-wall bunker		*/,
    DIFFBUNK: 1 /* different at each orientation	*/,
    GROUNDBUNK: 2 /* normal sit-on-ground bunker	*/,
    FOLLOWBUNK: 3 /* tracking bunker			*/,
    GENERATORBUNK: 4 /* generator type of bunker		*/,
    BUNKFRAMES: 8 /* # frames in animated bunkers	*/,
    BUNKFCYCLES: 2 /* time on one frame			*/,
    BRADIUS: 19 /* approx. radius of bunker		*/,
    SKILLBRADIUS: 30 /* for computing suicide kills	*/
  },
  fuel: {
    FUELHT: 32 /* height of fuel definition		*/,
    FUELCENTER: 16 /* center of top from top left	*/,
    FUELFRAMES: 8 /* frames in fuel animation		*/,
    FUELFCYCLES: 3 /* cycles each frame stays		*/,
    FRADIUS: 30 /* distance from fuel to pick it up	*/,
    BIGFRADIUS: 60
  },
  shard: {
    SHARDHT: 16 /* height of a shard in explosion	*/,
    SHARDKINDS: 7 /* should be >= BUNKKINDS		*/,
    SH_DISTRIB: 20 /* size of shard starting area	*/,
    SH_LIFE: 25 /* cycles shard stays alive		*/,
    SH_ADDLIFE: 15 /* added cycles shard stays alive	*/,
    EXPLSHARDS: 5 /* number of shards in bunker death	*/,
    EXPLGRAV: 5 /* gravity factor for shards		*/,
    SH_SPEED: 32 /* speed factor of shard (*256)	*/,
    SH_ADDSPEED: 16 /* possible amount over above		*/,
    SH_SLOW: 5 /* slow factor (0=stop, 1=1/2...)	*/,
    SH_SPIN2: 64 /* max speed of shard spin (*2*16)	*/
  },
  spark: {
    EXPLSPARKS: 20 /* number of sparks in bunker death	*/,
    SPARKLIFE: 10 /* minimum life of spark		*/,
    SPADDLIFE: 10 /* possible longer than SPARKLIFE	*/,
    SPARKSLOW: 7 /* slow factor (1=stop, ...)		*/,
    SP_SPEED16: 40 /* speed factor of spark (*16)	*/,

    SHIPSPARKS: 100 /* number of sparks in ship blowup	*/,
    SH_SPARKLIFE: 35 /* minimum life of ship spark		*/,
    SH_SPADDLIFE: 20 /* possible longer than SPARKLIFE	*/,
    SH_SP_SPEED16: 50 /* speed factor of spark (*16)	*/
  },
  strafe: {
    STRAFEHT: 8 /* height of a strafe			*/,
    STCENTER: 3 /* center of a strafe from upleft	*/,
    STRAFE_LIFE: 4 /* cycles strafes live			*/
  },
  crater: {
    CRATERHT: 32 /* height of crater image		*/,
    CRATERCENTER: 16 /* center of crater image		*/
  },

  /* possible values of currentsound	*/
  /*enum {NO_SOUND = 0, FIRE_SOUND, EXP1_SOUND, THRU_SOUND, BUNK_SOUND,
	SOFT_SOUND, SHLD_SOUND, FUEL_SOUND,
	EXP2_SOUND, EXP3_SOUND, CRACK_SOUND, FIZZ_SOUND, ECHO_SOUND};
  */

  /* MICODELAY	45		/* time to wait before killing planet */

  //  linerec:
  //{	int	startx, starty,		/* x,y of left endpoint			*/
  //		length,			/* the length(longest of x,y)		*/
  //		endx, endy;			/* x, y of right endpoint		*/
  //	short	up_down,			/* 1 if down, -1 if up			*/
  //		type;				/* direction of line: see below	*/
  //	int	kind,				/* normal, bounce, phantom, etc	*/
  //		h1, h2,			/* start & end h-vals of xor		*/
  //		newtype;			/* new type including up-down		*/
  //	struct _linerec *next,		/* next line of this kind		*/
  //		*nextwh;			/* next line with white-only drawing*/
  //},
  //
  /* Possible values for TYPE field in line record */
  type: { LINE_N: 1, LINE_NNE: 2, LINE_NE: 3, LINE_ENE: 4, LINE_E: 5 },

  /* Values for up_down field */
  up_down: {
    L_UP: -1 /* up line	*/,
    L_DN: 1 /* down line*/
  },

  /* Values for kind field */
  kind: { L_NORMAL: 0, L_BOUNCE: 1, L_GHOST: 2, L_EXPLODE: 3, L_NUMKINDS: 4 },

  /* Values for newtype field (combo of type & up_down) */
  newtype: {
    NEW_S: 1,
    NEW_SSE: 2,
    NEW_SE: 3,
    NEW_ESE: 4,
    NEW_E: 5,
    NEW_ENE: 6,
    NEW_NE: 7,
    NEW_NNE: 8
  }

  //  craterrec:
  //{	int	x, y;			/* global x and y positions		*/
  //} ,
  //
  //
  //  shotrec:
  //{	int	x, y, 		/* current global int x, y of shot	*/
  //		x8, y8,		/* x, y * 8 (global)			*/
  //		lifecount,		/* 0 if not going, time to death	*/
  //		v, h,			/* vert. & horiz speed * 8		*/
  //		strafedir,		/* rotation of strafe (-1 if none)	*/
  //		btime;		/* cycles to go after bouncing	*/
  //	linerec *hitline;		/* pointer to line that it hits	*/
  //},
  //
  //
  //  straferec:
  //{	int	x, y,			/* global x and y coordinates		*/
  //		rot,			/* direction of strafe			*/
  //		lifecount;		/* remaining life				*/
  //},
  //
  //
  //  rangerec:
  //{	int	low, high;		/* low and high sides of arc (0-511+) */
  //},
  //
  //  bunkrec:
  //{	int	x, y,			/* global x, y, of center of base	*/
  //		rot,			/* 0-15 for facing up, nne, etc	*/
  //		kind,			/* which kind of bunker			*/
  //		alive;		/* true if bunker is alive and well	*/
  //	rangerec ranges[2];	/* arcs in which bunker will fire	*/
  //	int	rotcount;		/* in animated, count to next frame	*/
  //},
  //
  //
  //  fuelrec:
  //{	int	x, y,			/* global x, y, of center of top	*/
  //		alive,		/* true if not picked up yet		*/
  //		currentfig,		/* 0-1 for which figure is being shown */
  //		figcount;		/* cycles this figure will be shown */
  //},
  //
  //  shardrec:
  //{	int	x, y,			/* global x, y, of upleft of shard 	*/
  //		h, v,			/* vertical and horizontal speed * 8*/
  //		rot16,		/* current rotation * 16		*/
  //		rotspeed,		/* added to rot16 every cycle		*/
  //		lifecount,		/* countdown to disappearance		*/
  //		kind;			/* which image (bunker came from)	*/
  //},
  //
  //
  ///* bookkeeping types of records */
  //
  //  hi_sc_rec:
  //{	char	thename[20];
  //	long	thescore;
  //	int	thelevel;
  //},
  //
  //
  //  graverec:			/* keeps a center of magnetism (gravity?) */
  //{
  //	int x, y, str;
  //}
}

export default GW

