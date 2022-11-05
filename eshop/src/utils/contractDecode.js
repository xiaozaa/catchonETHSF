export const getExtraData = async (Contract, method, args) => {
  switch (args.length) {
    case 0:
      return await Contract.methods[method]();
    case 1:
      return await Contract.methods[method](args[0]);
    case 2:
      return await Contract.methods[method](args[0], args[1]);
    case 3:
      return await Contract.methods[method](args[0], args[1], args[2]);
    case 4:
      return await Contract.methods[method](args[0], args[1], args[2], args[3]);
    case 5:
      return await Contract.methods[method](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4]
      );
    case 6:
      return await Contract.methods[method](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5]
      );
    case 7:
      return await Contract.methods[method](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
        args[6]
      );
    case 8:
      return await Contract.methods[method](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
        args[6],
        args[7]
      );
    default:
      break;
  }
};
