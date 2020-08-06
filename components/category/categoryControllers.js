const Category = require('./Category');
const Item = require('../item/Item');

const fetchAll = async (req, res) => {
  try {
    const categories = await Category.find().sort('-date').select('name items').populate('items', 'name price pcs');
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const createOne = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    console.log('name not supplied');
    return res.sendStatus(400);
  }
  try {
    const categoryAlreadyExists = await Category.findOne({ name });
    if (categoryAlreadyExists) {
      return res.status(200).json({ success: false, duplicate: true });
    }
    const newCategory = new Category({ name, items: [] });
    await newCategory.save();
    return res.status(200).json({
      success: true,
      newCategory: {
        _id: newCategory._id,
        name: newCategory.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const editOne = async (req, res) => {
  const { catId } = req.params;
  const { name } = req.body;
  if (!catId) {
    return res.sendStatus(400);
  }
  try {
    const category = await Category.findOne({ _id: catId });
    if (!category) {
      return res.sendStatus(400);
    }
    category.name = name;
    await category.save();
    return res.status(200).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// also delete all items associated with the category
const deleteOne = async (req, res) => {
  const { catId } = req.params;
  if (!catId) {
    return res.sendStatus(400);
  }
  try {
    const category = await Category.findOne({ _id: catId });
    await Category.findByIdAndRemove(catId);
    const items = await Item.find({ catId });

    async function deleteItems() {
      const promises = category.items.map(async (item, index) => {
        await Item.findByIdAndRemove(item);
      });

      await Promise.all(promises);
    }
    await deleteItems();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const genStruct = async (req, res) => {
  try {
    // fetch total item cps and price
    let globalTotalPcs = 0;
    let globalTotalPrice = 0;
    const fetchedItems = await Item.find().select('name price pcs catId').populate('catId', 'name');

    fetchedItems.forEach((item) => {
      globalTotalPcs = globalTotalPcs + item.pcs;
      globalTotalPrice = globalTotalPrice + item.pcs * item.price;
    });

    let fetchedCategories = await Category.find().select('name items').populate('items', 'name price pcs');

    fetchedCategories = fetchedCategories.map((cat) => {
      const { localPrice, localPcs } = calclateLocalPriceAndPcs(cat.items);
      let modCat = {};
      modCat._id = cat._id;
      modCat.name = cat.name;
      modCat.localPcs = localPcs;
      modCat.localPrice = localPrice;
      modCat.pcsVsGlobal = (localPcs / globalTotalPcs) * 100;
      modCat.priceVsGlobal = (localPrice / globalTotalPrice) * 100;
      modCat.items = cat.items;
      return modCat;
    });
    const modArrItems = fetchedItems.map((item) => {
      const category = fetchedCategories.find((cat) => {
        return cat.name === item.catId.name;
      });
      let mod = {};
      mod._id = item._id;
      mod.name = item.name;
      mod.price = item.price;
      mod.pcs = item.pcs;
      mod.category = item.catId.name;
      mod.totalPrice = item.pcs * item.price;
      mod.pcsPerGlobal = (item.pcs / globalTotalPcs) * 100;
      mod.pricePerGlobal = (mod.totalPrice / globalTotalPrice) * 100;
      mod.pcsPerLocal = (item.pcs / category.localPcs) * 100;
      mod.pricePerLocal = (mod.totalPrice / category.localPrice) * 100;

      return mod;
    });

    return res
      .status(200)
      .json({ success: true, globalTotalPcs, globalTotalPrice, items: modArrItems, categories: fetchedCategories });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  fetchAll,
  createOne,
  editOne,
  deleteOne,
  genStruct,
};

const calclateLocalPriceAndPcs = (items) => {
  let localPrice = 0;
  let localPcs = 0;
  items.forEach((item) => {
    localPcs = localPcs + item.pcs;
    localPrice = localPrice + item.pcs * item.price;
  });
  return {
    localPcs,
    localPrice,
  };
};
