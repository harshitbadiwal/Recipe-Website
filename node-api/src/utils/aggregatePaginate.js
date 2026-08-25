/**
 * Reusable MongoDB Aggregate Paginate Utility
 * Performs aggregation pipeline with $facet stage for high-performance atomic pagination & counting
 * 
 * @param {import('mongoose').Model} model - Mongoose Model
 * @param {Array} pipeline - Pre-pagination aggregation stages ($match, $lookup, $project, etc.)
 * @param {Object} options - { page, limit, sort }
 * @returns {Promise<{ data: Array, meta: { total: Number, page: Number, limit: Number, totalPages: Number, hasPrevPage: Boolean, hasNextPage: Boolean } }>}
 */
const aggregatePaginate = async (model, pipeline = [], options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const skip = (page - 1) * limit;

  // Sorting stage if provided
  const sortStage = options.sort ? [{ $sort: options.sort }] : [];

  const facetPipeline = [
    ...pipeline,
    ...sortStage,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await model.aggregate(facetPipeline);

  const data = result ? result.data : [];
  const total = result && result.totalCount.length > 0 ? result.totalCount[0].count : 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };
};

module.exports = aggregatePaginate;
