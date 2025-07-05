import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = 'data.json';


const markcommit = async (x, y) => {
    try {
        const date = moment()
            .subtract(1, "y")
            .add(1, "d")
            .add(x, "w")
            .add(y, "d")
            .format();

        const data = {
            date: date
        };

        await jsonfile.writeFile(path, data);
        const git = simpleGit();
        await git.add([path]);
        await git.commit(`Update date to ${date}`, undefined, { '--date': date });
        await git.push();
        console.log('Commit and push successful!');
    } catch (error) {
        console.error('Error during git operations:', error);
    }
};

markcommit(51, 2);