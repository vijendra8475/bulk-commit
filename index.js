import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = 'data.json';

const markcommit = async (x, y) => {
    try {
        // Ensure y is from 0 (Sunday) to 6 (Saturday)
        if (y < 0 || y > 6) throw new Error("y must be in range 0–6 (Sunday to Saturday)");

        const date = moment()
            .subtract(1, 'year')     // Start one year ago
            .startOf('week')         // Align to Sunday
            .add(x, 'weeks')         // x weeks forward
            .add(y, 'days')          // y-th day of that week
            .format();               // Default ISO format

        const data = { date };

        await jsonfile.writeFile(path, data);

        const git = simpleGit();
        await git.add([path]);
        await git.commit(`Update date to ${date}`, undefined, { '--date': date });
        await git.push();

        console.log(`✅ Commit made for (${x}, ${y}) → ${date}`);
    } catch (error) {
        console.error('❌ Error during git operations:', error.message || error);
    }
};

// Example usage:
markcommit(51, 0); // Sunday (top row), last column
