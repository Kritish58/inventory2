const Item = require('./Item');
const Category = require('../category/Category');

const fetchAll = async (req, res) => {
  try {
    const items = await Item.find().sort('-date').select('name price pcs catId').populate('catId', 'name');
    let totalPcs = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      totalPcs = totalPcs + item.pcs;
      totalPrice = totalPrice + item.pcs * item.price;
    });
    return res.status(200).json({ success: true, items, totalItems: items.length, totalPcs, totalPrice });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const fetchFromCategory = async (req, res) => {
  const { catId } = req.query;
  if (!catId) {
    return res.sendStatus(400);
  }
  try {
    const items = await Item.find({ catId })
      .sort('-date')
      .select('name price pcs category')
      .populate('category', 'name');
    let totalPcs = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      totalPcs = totalPcs + item.pcs;
      totalPrice = totalPrice + item.pcs * item.price;
    });
    return res.status(200).json({ success: true, items, totalPrice, totalPcs, totalItems: items.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const createOne = async (req, res) => {
  const { catId } = req.params;
  const { name, price, pcs } = req.body;
  if (!name || !price || !pcs || !catId) {
    return res.sendStatus(40);
  }
  try {
    const alreadyExists = await Item.findOne({ name, catId });
    if (alreadyExists) {
      return res.status(200).json({ success: false, duplicate: true });
    }
    const newItem = new Item({
      name,
      price,
      pcs,
      catId,
    });
    await newItem.save();
    const category = await Category.findOne({ _id: catId });
    if (category) {
      category.items.push(newItem._id);
    }
    await category.save();

    return res.status(200).json({
      success: true,
      newItem: {
        _id: newItem._id,
        name: newItem.name,
        price: newItem.price,
        pcs: newItem.pcs,
        category: category.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const changeCategory = async (req, res) => {
  const { catId } = req.params;
  const { itemId } = req.body;
  if (!catId || !itemId) {
    return res.sendStatus(400);
  }
  try {
    const item = await Item.findOne({ _id: itemId });
    const category = await Category.findOne({ _id: catId });
    if (!item || !category) {
      return res.sendStatus(400);
    }
    const items = category.items.filter((item) => item.toString() !== itemId);
    category.items = items;
    await category.save();

    item.catId = catId;
    await item.save();
    return res.status(200).json({
      success: true,
      item: {
        _id: item._id,
        name: item.name,
        price: item.price,
        pcs: item.pcs,
        catId: {
          _id: catId,
          name: category.name,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
const editOne = async (req, res) => {
  const { itemId } = req.params;
  const { name, price, pcs, catId } = req.body;
  if (!itemId || !name || !price || !pcs) {
    return res.sendStatus(400);
  }
  try {
    const item = await Item.findOne({ _id: itemId });
    const category = await Category.findOne({ _id: catId });
    if (!item || !category) {
      return res.sendStatus(400);
    }
    item.catId = catId;
    item.name = name;
    item.price = price;
    item.pcs = pcs;
    await item.save();

    const alreadyExists = category.items.find((item) => {
      if (item.toString() === itemId) {
        return item;
      }
    });
    if (!alreadyExists) {
      category.items.push(itemId);
      await category.save();
    }

    return res.status(200).json({
      success: true,
      item: {
        _id: item._id,
        name: item.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const deleteOne = async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) {
    return res.sendStatus(400);
  }
  try {
    const item = await Item.findOne({ _id: itemId });
    const category = await Category.findOne({ _id: item.catId });
    const items = category.items.filter((item) => item.toString() !== itemId);
    category.items = items;
    await category.save();

    await Item.findByIdAndRemove(itemId);
    return res.status(200).json({
      success: true,
      item: {
        _id: item._id,
        name: item.name,
        price: item.price,
        pcs: item.pcs,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  fetchAll,
  fetchFromCategory,
  createOne,
  editOne,
  changeCategory,
  deleteOne,
};

// const editName = async (req, res) => {
//   const { itemId } = req.params;
//   const { name } = req.body;
//   if (!itemId) {
//     return res.sendStatus(400);
//   }
//   try {
//     const item = await Item.findOne({ _id: itemId });
//     if (!item) {
//       return res.sendStatus(400);
//     }
//     item.name = name;
//     await item.save();
//     return res.status(200).json({
//       success: true,
//       item: {
//         _id: item._id,
//         name: item.name,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// const editPrice = async (req, res) => {
//   const { itemId } = req.params;
//   const { price } = req.body;
//   if (!itemId) {
//     return res.sendStatus(400);
//   }
//   try {
//     const item = await Item.findOne({ _id: itemId });
//     if (!item) {
//       return res.sendStatus(400);
//     }
//     item.price = price;
//     await item.save();
//     return res.status(200).json({
//       success: true,
//       item: {
//         _id: item._id,
//         price: item.price,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// const editPcs = async (req, res) => {
//   const { itemId } = req.params;
//   const { pcs } = req.body;
//   if (!itemId) {
//     return res.sendStatus(400);
//   }
//   try {
//     const item = await Item.findOne({ _id: itemId });
//     if (!item) {
//       return res.sendStatus(400);
//     }
//     item.pcs = pcs;
//     await item.save();
//     return res.status(200).json({
//       success: true,
//       item: {
//         _id: item._id,
//         pcs: item.pcs,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };
