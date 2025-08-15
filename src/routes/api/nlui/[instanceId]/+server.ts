import { getNLUIPropsById } from '$lib/server/mcpServer';
import { logger } from '$lib/utils/logger';
import { error, json } from '@sveltejs/kit';

/**
 * GET /api/nlui/[instanceId]
 * 根据instanceId获取NLUIProps配置
 * Get NLUIProps configuration by instanceId
 */
export async function GET({ params }: { params: { instanceId: string } }) {
  const { instanceId } = params;

  try {
    if (!instanceId) {
      logger.warn('Missing instanceId parameter', {
        component: 'NLUIApi',
        action: 'getNLUIProps',
        metadata: { instanceId: null }
      });
      return error(400, 'Missing instanceId parameter');
    }

    const nluiProps = getNLUIPropsById(instanceId);

    if (!nluiProps) {
      logger.warn('NLUIProps configuration not found', {
        component: 'NLUIApi',
        action: 'getNLUIProps',
        metadata: { instanceId, found: false }
      });
      return error(404, 'NLUIProps configuration not found');
    }

    return json(nluiProps);
  } catch (err) {
    logger.error('Error retrieving NLUIProps configuration', err, {
      component: 'NLUIApi',
      action: 'getNLUIProps',
      metadata: { instanceId }
    });
    return error(500, 'Internal server error');
  }
}
