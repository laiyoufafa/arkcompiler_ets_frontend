{
    let a = [1, 2, 3];
    let b = [];

    for (let i of a) {
        b.push(() => {
            print(i, a);
        });
    }

    b.forEach(f => f());
}