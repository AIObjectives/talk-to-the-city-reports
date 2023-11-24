import { csv } from '$lib/compute/csv';
import { merge } from '$lib/compute/merge';
import { cluster_extraction } from '$lib/compute/cluster_extraction';
import { argument_extraction } from '$lib/compute/argument_extraction';
import { open_ai_key } from '$lib/compute/open_ai_key';
import { report } from '$lib/compute/report';
import { participant_filter } from '$lib/compute/participant_filter';
import { limit_csv } from '$lib/compute/limit_csv';
import { translate } from '$lib/compute/translate';
import { edit_csv } from '$lib/compute/edit_csv';

export const compute = {
	open_ai_key_v0: open_ai_key,
	csv_v0: csv,
	cluster_extraction_v0: cluster_extraction,
	argument_extraction_v0: argument_extraction,
	report_v0: report,
	participant_filter_v0: participant_filter,
	merge_v0: merge,
	limit_csv_v0: limit_csv,
	translate_v0: translate,
	edit_csv_v0: edit_csv
};
