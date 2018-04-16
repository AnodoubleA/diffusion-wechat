import Segment from "../Segment"

export default class AbstractSegment extends Segment {
	key = null;
	padding = null;
	algorithm = null;
	info = null;
	fill = 0;

	init(option) {
		this.key = option.key;
		this.algorithm = option.algorithm;
		this.padding = option.padding;
		this.info = option.info;
		if (this.padding) {
			this.fill = this.padding.compute(this.info.N);
		}
	}
}