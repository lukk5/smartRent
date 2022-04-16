using System;

namespace smartRent.BackEnd.Utils
{
    public static class Try
    {
        public static Try<TResult> Action<TResult>(Func<TResult> act)
        {
            return new(act);
        }
    }

    public class Try<TResult>
    {
        Func<TResult> action;

        internal Try(Func<TResult> action)
        {
            this.action = action;
        }

        public TResult Finally(int retryTimes)
        {
            try
            {
                return action();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);

                while (retryTimes > 0)
                {
                    retryTimes--;
                    Console.WriteLine($"RetryTimeLeft: {retryTimes}");
                    action();
                }

                throw;
            }
        }
    }
}