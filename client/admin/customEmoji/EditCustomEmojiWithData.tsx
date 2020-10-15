import React, { useMemo, FC } from 'react';
import { Box, Button, ButtonGroup, Skeleton, Throbber, InputBox } from '@rocket.chat/fuselage';

import { useTranslation } from '../../contexts/TranslationContext';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import EditCustomEmoji from './EditCustomEmoji';
import { EmojiDescriptor } from './types';

type EditCustomEmojiWithDataProps = {
	_id: string;
	cache: unknown;
	close: () => void;
	onChange: () => void;
};

const EditCustomEmojiWithData: FC<EditCustomEmojiWithDataProps> = ({ _id, cache, onChange, ...props }) => {
	const t = useTranslation();
	const query = useMemo(() => ({
		query: JSON.stringify({ _id }),
	// TODO: remove cache. Is necessary for data invalidation
	}), [_id, cache]);

	const {
		data = {
			emojis: {
				update: [],
			},
		},
		state,
		error,
	} = useEndpointDataExperimental<{
		emojis?: {
			update: EmojiDescriptor[];
		};
	}>('emoji-custom.list', query);

	if (state === ENDPOINT_STATES.LOADING) {
		return <Box pb='x20'>
			<Skeleton mbs='x8'/>
			<InputBox.Skeleton w='full'/>
			<Skeleton mbs='x8'/>
			<InputBox.Skeleton w='full'/>
			<ButtonGroup stretch w='full' mbs='x8'>
				<Button disabled><Throbber inheritColor/></Button>
				<Button primary disabled><Throbber inheritColor/></Button>
			</ButtonGroup>
			<ButtonGroup stretch w='full' mbs='x8'>
				<Button primary danger disabled><Throbber inheritColor/></Button>
			</ButtonGroup>
		</Box>;
	}

	if (error || !data || !data.emojis || data.emojis.update.length < 1) {
		return <Box fontScale='h1' pb='x20'>{t('Custom_User_Status_Error_Invalid_User_Status')}</Box>;
	}

	return <EditCustomEmoji data={data.emojis.update[0]} onChange={onChange} {...props}/>;
};

export default EditCustomEmojiWithData;
