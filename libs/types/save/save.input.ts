import { SaveGroup } from '../../enums/save.enum';

export interface SaveInput {
	memberId: string;
	saveRefId: string;
	saveGroup: SaveGroup;
}
