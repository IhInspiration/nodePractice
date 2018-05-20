export default function autobind(...args) {
  if(args.length === 1) {
    return autobindClass(...args);
  } else {
    return autobindMethod(...args);
  }
}

function autobindClass(target) {
  const allProp = Object.getOwnPropertyNames(target.prototype);

  allProp.forEach((key) => {
    if (key === 'constructor') {
      return;
    }

    let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

    if(typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, autobindMethod(target.prototype, key, descriptor));
    }
  });
  
  return target;
}

function autobindMethod(target, name, descriptor) {
  // 点语法就已经开始执行这块了
  let fn = descriptor.value;

  if(typeof fn !== 'function') {
    throw new Error("不能修饰非函数属性");
  }

  return {
    configurable: true,
    get() {
      // 初始化的时候this指向组件继承的Component
      // 组件实例化之后this指向组件本身(new 的过程)
      if(this === target || typeof fn !== 'function') {
        console.log(`不用进行了${fn}`);
        return fn;
      }

      let boundFn = fn.bind(this);

      // 一个使用之后将其设置为永久绑定好的了
      Object.defineProperty(this, name, {
        configurable: true,
        get() {
          return boundFn;
        },
        set(value) {
          fn = value;
          delete this[name];
        }
      })

      return boundFn;
    },
    set(value) {
      fn = value;
    }
  }
} 