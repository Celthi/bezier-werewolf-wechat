
import Unskilled from './Unskilled';
import TargetlessSkill from './TargetlessSkill';
import SinglePlayerSkill from './SinglePlayerSkill';
import TwoPlayerSkill from './TwoPlayerSkill';
import SingleCardSkill from './SingleCardSkill';
import SeerSkill from './SeerSkill';
import WitchSkill from './WitchSkill';

const skills = [
	// Unknown
	Unskilled,

	// Werewolf
	TargetlessSkill,

	// Villager
	Unskilled,

	// Seer
	SeerSkill,

	// Tanner
	Unskilled,

	// Minion
	TargetlessSkill,

	// Troublemaker
	TwoPlayerSkill,

	// Robber
	SinglePlayerSkill,

	// Drunk
	SingleCardSkill,

	// Mason
	TargetlessSkill,

	// Hunter
	Unskilled,

	// Witch
	WitchSkill,
];

export default skills;
