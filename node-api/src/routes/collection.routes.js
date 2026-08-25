const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCollectionValidator,
  updateCollectionValidator,
} = require('../validators/collection.validator');

// Public collection route
router.get('/public/:id', collectionController.getCollectionById);

// Protected collection routes
router.use(authenticate);

router.post('/', validate(createCollectionValidator), collectionController.createCollection);
router.get('/', collectionController.getUserCollections);
router.get('/:id', collectionController.getCollectionById);
router.patch('/:id', validate(updateCollectionValidator), collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

router.post('/:id/recipes/:recipeId', collectionController.addRecipeToCollection);
router.delete('/:id/recipes/:recipeId', collectionController.removeRecipeFromCollection);

module.exports = router;
