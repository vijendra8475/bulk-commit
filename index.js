import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = 'data.json';
const git = simpleGit();

// Number of commits to generate
const totalCommits = 50;

// Generate a random integer between min and max (inclusive)
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const markcommit = async (x, y, commitCount = 1) => {
    try {
        if (y < 0 || y > 6) throw new Error("y must be in range 0–6 (Sunday to Saturday)");

        const baseDate = moment()
            .subtract(1, 'year')
            .startOf('week')
            .add(x, 'weeks')
            .add(y, 'days');

        for (let i = 0; i < commitCount; i++) {
            const commitDate = baseDate.clone().add(i, 'minutes').format();

            const data = { date: commitDate };
            await jsonfile.writeFile(path, data);

            await git.add([path]);
            await git.commit(`Random commit ${i + 1} on (${x}, ${y})`, undefined, {
                '--date': commitDate,
            });

            console.log(`✅ Commit ${i + 1} done at (${x}, ${y}) → ${commitDate}`);
        }

        await git.push();
        console.log('🚀 All commits pushed to GitHub.');
    } catch (error) {
        console.error('❌ Error:', error.message || error);
    }
};

const run = async () => {
    for (let i = 0; i < totalCommits; i++) {
        const x = random(0, 51); // 52 weeks
        const y = random(0, 6);  // 7 days (Sun to Sat)
        const commitCount = random(1, 3); // 1–3 commits per spot

        await markcommit(x, y, commitCount);
    }
};

run();
