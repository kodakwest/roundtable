CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  series TEXT NOT NULL,
  date TEXT NOT NULL,
  scripture_map TEXT NOT NULL,
  anchor_reference TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  theme TEXT NOT NULL,
  framing_sentence TEXT NOT NULL,
  sections TEXT NOT NULL,
  landing_paragraph TEXT NOT NULL,
  landing_question TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR REPLACE INTO guides (
  id, title, series, date, scripture_map, anchor_reference, anchor_text,
  theme, framing_sentence, sections, landing_paragraph, landing_question
) VALUES (
  'armor-for-the-mind',
  'Armor for the Mind — Truth in a World of Deception',
  'Battle of the Mind',
  '2026-03-01',
  '2 Corinthians 10:3-5 · Ephesians 6:11-18 · 1 Timothy 1:18-20 · 2 Timothy 4:2-5 · Romans 8:6 · James 1:12',
  '2 Corinthians 10:3-5',
  'For though we live in the flesh, we do not war according to the flesh. For the weapons we fight with are not the weapons of the world. On the contrary, they have divine power to demolish strongholds. We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.',
  'The battle for the mind is real, and the only armor that holds is God''s truth.',
  'Truth has become negotiable — algorithms feed us what confirms our biases, and information moves faster than verification.',
  '[{"title":"The Armor of Truth","context":"2 Corinthians 10:4-5 — The weapons of our warfare are not worldly but have divine power to demolish strongholds. We take every thought captive to make it obedient to Christ. 1 Timothy 1:18-19 calls us to ''fight the battle well, holding on to faith and a good conscience.'' Before we can stand against deception, we must recognize how our minds are being shaped — by algorithms, by political narratives, by content designed to provoke rather than inform.","questions":[{"id":"atm-q1","prompt":"Where do you see this happening in your own information diet — news, social media, workplace?"},{"id":"atm-q2","prompt":"''Taking every thought captive'' is active, not passive. What would that look like today — before you click, before you share, before you react?"}]},{"title":"Integrity Over Image","context":"1 Timothy 3:1-7, Titus 1:5-9 — Leaders must be above reproach, not lovers of money, not quick-tempered, holding fast to sound teaching. The gap between public image and private reality isn''t just hypocrisy — it''s a spiritual deception that conditions us to believe lies.","questions":[{"id":"atm-q3","prompt":"When have you seen a gap between someone''s public image and private reality? How did that affect your trust — not just in them, but in the systems or institutions they represented?"},{"id":"atm-q4","prompt":"''If a leader won''t tell the truth about themselves, how can they be trusted with truth about anything else?'' Where do you need to check your own integrity gap?"}]},{"title":"Wisdom Over Noise","context":"1 Corinthians 2:10-16, Romans 12:1-2 — The Spirit searches all things, even the deep things of God. Do not be conformed to this world, but be transformed by the renewing of your mind. We cannot outsource discernment to algorithms. Spiritual wisdom is personal — it comes from knowing God, not from processing more data.","questions":[{"id":"atm-q5","prompt":"When have you felt the pull to let someone else (an algorithm, a news channel, a political tribe) do your thinking for you?"},{"id":"atm-q6","prompt":"''Do not be conformed'' suggests pressure is constant. What would it look like to intentionally renew your mind this week — not just consume less, but replace noise with something truer?"}]}]',
  'Four passages were laid out at the start — 2 Corinthians 10, Ephesians 6, 1 Timothy 1, 2 Timothy 4 — but they''re really one battle plan: the mind is the frontline, and truth is the only weapon that holds. Paul''s charge to Timothy in 2 Timothy 4 — ''preach the word, be ready in season and out of season'' — is the same charge we get today, not as preachers but as people who must decide what''s real before we can decide what''s right. The armor doesn''t fit if we''re not willing to put it on daily.',
  'Where in your life have you been sleepwalking — letting the world decide what''s true for you — and what would it look like to wake up tomorrow?'
);

INSERT OR REPLACE INTO guides (
  id, title, series, date, scripture_map, anchor_reference, anchor_text,
  theme, framing_sentence, sections, landing_paragraph, landing_question
) VALUES (
  'battle-of-the-mind-women',
  'Battle of the Mind — Women',
  'Battle of the Mind',
  '2026-05-10',
  '1 Timothy 1:18-19, 2:1-15 · Galatians 3:28 · Matthew 19:4 · Proverbs 11:22 · Romans 16:7',
  '1 Timothy 1:18-19',
  'I am giving you this command... so that by recalling them you may fight the battle well, holding on to faith and a good conscience.',
  'Equal in worth, distinct in design. God''s word restores women to dignity.',
  'The battle for women''s identity is real, and it must be fought with faith and a clear conscience — not by the culture''s rules, but by God''s.',
  '[{"title":"Equal Value, NOT Equal","context":"Galatians 3:28 affirms spiritual equality. Matthew 19:4 affirms male and female as part of creation. Equal worth does not mean identical roles — the distinction is by design, not hierarchy.","questions":[{"id":"btmw-q1","prompt":"The culture says if you are not identical, you are not equal. Where do you feel this pressure most?"},{"id":"btmw-q2","prompt":"Female suicide is up 50% since 2000 and life satisfaction dropped as workforce participation rose. Does that change how you think about what women actually need?"}]},{"title":"Propriety, NOT Rebellion","context":"1 Timothy 2:9-10 — Paul''s words about modest dress are often read as restrictions, but the context changes everything: Ephesus was the center of Artemis worship, where seductive clothing was part of religious practice. Paul is disentangling Christian women from that cult identity, not imposing a universal ban. The goal is dignity, not silence.","questions":[{"id":"btmw-q3","prompt":"Paul called women out of Artemis worship, not out of leadership. What is our culture''s ''Artemis'' — the identity markers it pressures women to wear or display?"},{"id":"btmw-q4","prompt":"''A gold ring in a pig''s snout'' (Proverbs 11:22). Where is the culture asking women to put their worth in the wrong place?"}]},{"title":"Useful, NOT Sidelined","context":"The same Paul who wrote 1 Timothy also named Junias an apostle, Phoebe a deacon, and Priscilla a teacher. Women led. The question is not whether women can lead, but how they lead in a way that honors their design.","questions":[{"id":"btmw-q5","prompt":"Think of a woman who shaped your faith. What did she teach you that no one else could?"},{"id":"btmw-q6","prompt":"Does your church treat women as useful to the mission or sidelined from it? Where could that improve?"}]}]',
  'Paul''s words in 1 Timothy 2 aren''t a burden — they''re a rescue mission, calling women back to dignity. The culture defines women by liberation; the church has too often defined them by limitation. Neither is the battle Paul calls us to fight in 1 Timothy 1:18-19. The biblical picture is better: equal worth, distinct design, essential to the mission. Holding on to faith and a good conscience means rejecting both false narratives.',
  'Where do you need to admit you need help — from God, from the women in your life, or from your church — to see and honor women the way Scripture does, not the way the culture does?'
);

INSERT OR REPLACE INTO guides (
  id, title, series, date, scripture_map, anchor_reference, anchor_text,
  theme, framing_sentence, sections, landing_paragraph, landing_question
) VALUES (
  'designed-on-purpose',
  'Designed — On Purpose',
  'Designed',
  '2020-01-05',
  'Psalm 139:13-14 · Genesis 1:26-27 · 1 Corinthians 6:19 · Ephesians 2:10 · Psalm 139:1-24',
  'Psalm 139:13-14',
  'For you created my inmost being; you knit me together in my mother''s womb. I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
  'You are not an accident. God created you on purpose, in His image, for a purpose.',
  'Middle schoolers carry anxiety that would have been institutionalized in the 1950s. Teen suicide rates up 56% in a decade. The prevailing message to young people is that they are accidents of nature with no purpose.',
  '[{"title":"God Created You","context":"Psalm 139:13-14 and Genesis 1:26-27 — If you remove the Creator, you devalue the creation. A painting''s value depends on who made it. The philosopher Quentin Smith put it bluntly: ''the most reasonable belief is that we came from nothing, by nothing and for nothing.'' That worldview leaves no foundation for meaning or purpose. But the opening pages of Scripture say something radically different — you carry the image of the invisible God.","questions":[{"id":"dop-q1","prompt":"The culture tells young people they are cosmic accidents. How does that belief shape a person''s sense of worth, their decisions, their future?"},{"id":"dop-q2","prompt":"''Your body is a work of art from God'' — what would change in how you treat your body if you truly believed you carry the image of God?"}]},{"title":"Embrace His Design","context":"Ephesians 2:10 — ''For we are God''s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.'' Sin damages the image of God in us. It doesn''t destroy it, but it distorts it. The answer isn''t to justify the brokenness — it''s to let God recreate you. Embracing God''s design means accepting that He made you the way you are on purpose, not by accident.","questions":[{"id":"dop-q3","prompt":"''God doesn''t make mistakes'' — what part of your identity or story feels hardest to believe that about right now?"},{"id":"dop-q4","prompt":"A platypus doesn''t fit any mold — mammal that lays eggs, duck bill, beaver tail. Yet it exists exactly as designed. Where have you felt pressure to fit a mold that wasn''t made for you?"}]},{"title":"Live as Image Bearers","context":"1 Corinthians 6:19 — ''Do you not know that your bodies are temples of the Holy Spirit, who is in you?'' Psalm 139:23-24 — ''Search me, God, and know my heart; test me and know my anxious thoughts.'' The call is to be a ''Daniel Generation'' — people who remain faithful whether they face the fire or the lion''s den.","questions":[{"id":"dop-q5","prompt":"If someone lives like they''re a cosmic accident, how does that show up in their choices — with their body, their time, their relationships?"},{"id":"dop-q6","prompt":"''Will you commit to relationship with Him until that image is revealed?'' — what''s one way you can actively lean into that commitment this week?"}]}]',
  'Psalm 139:13-14 opens with the raw declaration that we are ''fearfully and wonderfully made.'' But that''s not just a feel-good line — it''s a claim about reality. If God created us, then we have a Creator, a design, and a purpose. The crisis of anxiety, addiction, and despair in our culture isn''t a mystery — it''s the logical result of telling people they''re meaningless accidents. The answer isn''t more self-esteem tips. It''s returning to the truth that we were made by Someone, for Someone — that our bodies carry His image and are temples of His Spirit. The Daniel Generation lives like that''s real, even when the fire is hot.',
  'What would change in your life this week if you woke up every morning and said, ''God made me on purpose, for a purpose'' — and actually believed it?'
);

INSERT OR REPLACE INTO guides (
  id, title, series, date, scripture_map, anchor_reference, anchor_text,
  theme, framing_sentence, sections, landing_paragraph, landing_question
) VALUES (
  'finish-strong',
  'Battle of the Mind — Finish Strong',
  'Battle of the Mind',
  '2026-05-15',
  '1 Timothy 1:18-19 · 2 Timothy 1:8-10, 1:12 · 2 Timothy 2:8-14 · 2 Timothy 3:10-13 · 2 Timothy 4:6-8, 4:16-18',
  '1 Timothy 1:18-19',
  'I am giving you this command... so that by recalling them you may fight the battle well, holding on to faith and a good conscience.',
  'Finishing well requires suffering, faith, and a settled conviction that God stays faithful to the end.',
  'Paul is writing from prison at the end of his life, and he is not trying to impress anyone. He is showing what it looks like to finish faithful when the pressure is real, the losses are piling up, and the race is almost over.',
  '[{"title":"Provided to Finish","context":"If God is the one who called you, chained circumstances cannot cancel what He has already set in motion. Paul wrote from a Roman dungeon, but he never confused his chains with the gospel''s reach. 2 Timothy 2:9 reminds us that while Paul was chained like a criminal, God''s word is not chained. 2 Timothy 2:13 declares that even if we are faithless, he remains faithful, for he cannot disown himself.","questions":[{"id":"fs-q1","prompt":"Where in your life do circumstances feel like they''re closing in? What would change if you believed God''s word is not bound by your situation?"},{"id":"fs-q2","prompt":"''If we are faithless, he remains faithful.'' When have you been the faithless one and discovered God hadn''t moved?"}]},{"title":"The Cost of Finishing","context":"Everyone who wants to live a godly life will face opposition. Paul''s resume included persecutions and sufferings — not despite them, but through them. 2 Timothy 1:12 shows his settled conviction: ''I know whom I have believed, and am convinced that he is able to guard what I have entrusted to him until that day.''","questions":[{"id":"fs-q3","prompt":"The sermon opened with three people who finished poorly — a famous author, a pastor, a ministry leader. Not one planned to end that way. When does starting well feel easier than finishing well?"},{"id":"fs-q4","prompt":"Paul was convinced, not hopeful. Is there an area where you''re still trying to talk yourself into faith?"}]},{"title":"Poured Out for a Purpose","context":"Water poured on the ground can''t be gathered back. Paul used that image for his own life in 2 Timothy 4:6-8: ''I am already being poured out like a drink offering... I have fought the good fight, I have finished the race, I have kept the faith.'' And in 2 Timothy 4:16-18, even when everyone deserted him at his first defense, the Lord stood at his side and gave him strength.","questions":[{"id":"fs-q5","prompt":"What would it look like to live as if your life has already been poured out — every part given away?"},{"id":"fs-q6","prompt":"No one showed up for Paul. He forgave them and kept going. Who or what would you need to release in order to finish well?"}]}]',
  'The battle Paul calls us to fight in 1 Timothy 1:18-19 is fought with faith and a good conscience — not a perfect life, but a poured-out one. The crown of righteousness isn''t for those who started well. It''s for those who long for His appearing and keep fighting to the end.',
  'If your life ended today, what would be the unfinished business between you and God?'
);

INSERT OR REPLACE INTO guides (
  id, title, series, date, scripture_map, anchor_reference, anchor_text,
  theme, framing_sentence, sections, landing_paragraph, landing_question
) VALUES (
  'real-faith',
  'Real Faith',
  'Luke',
  '2026-02-15',
  'Luke 7:1-10 · Luke 7:11-16 · Luke 7:17-23',
  'Luke 7:23',
  'Blessed is the man who does not fall away on account of me.',
  'Faith doesn''t come in one size. Whether you''re believing big, grieving hard, or doubting in the dark, Jesus meets you where you are.',
  'Faith isn''t a formula that guarantees outcomes. It''s trust in a person even when the outcome doesn''t make sense.',
  '[{"title":"The Centurion — Great Faith","context":"A Roman officer — outsider, military guy, not raised in the faith — and Jesus says he has the most faith in all of Israel. Why? Two things: humility and authority. The centurion knew he didn''t deserve anything from Jesus, and he understood that Jesus had power over sickness the same way he had authority over his soldiers.","questions":[{"id":"rf-q1","prompt":"There''s a brand of ''faith'' circulating that''s really New Age thinking with Bible verses mixed in — where you claim power through your own words instead of trusting God''s authority. Have you ever caught yourself thinking your faith was the deciding factor instead of Jesus'' power? What''s the difference?"},{"id":"rf-q2","prompt":"The centurion was humble and confident. How do you hold both of those at the same time without tipping into false humility on one side or overconfidence on the other?"}]},{"title":"The Widow of Nain — No Faith","context":"A widow loses her only son — her last source of security, identity, and provision. She''s not asking Jesus for anything. She''s not even aware he''s there. And Jesus raises her son anyway. No faith required. This is pure compassion — Jesus didn''t need her to pass a belief test first. He saw her pain and acted.","questions":[{"id":"rf-q3","prompt":"Think of a time when Jesus showed up in a situation where you didn''t even have the strength to ask. What happened?"},{"id":"rf-q4","prompt":"''Jesus cares about the things you care about.'' Do you actually believe that? What would change if you lived like it was true?"}]},{"title":"John the Baptist — Doubting Faith","context":"John baptized Jesus. He saw the Holy Spirit descend. He knew Jesus was the Messiah. And then he ended up in prison with his head on the line while Jesus was healing everybody else. So he sent his disciples to ask, ''Are you the one, or should we expect someone else?'' Doubt doesn''t mean you don''t believe. It means you''re suffering and you''re honest about it.","questions":[{"id":"rf-q5","prompt":"Which of these three stories do you identify with right now: the centurion with great faith, the widow just trying to survive, or John in prison wondering where God went?"},{"id":"rf-q6","prompt":"''Blessed is the one who does not fall away on account of me.'' That''s Jesus saying, ''Don''t let what you don''t understand cost you what you do know.'' What''s one thing you know to be true about God even when your circumstances don''t line up?"}]}]',
  'John the Baptist had all the theology right and still ended up beheaded. Faith isn''t a formula that guarantees outcomes. It''s trust in a person even when the outcome doesn''t make sense.',
  'The widow of Nain didn''t ask for anything. The centurion believed from a distance. John doubted from a prison cell. Where are you really at with Jesus right now — and what would it look like to be honest with him about it this week?'
);

